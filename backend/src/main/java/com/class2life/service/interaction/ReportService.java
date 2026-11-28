package com.class2life.service.interaction;

import com.class2life.common.PageResponse;
import com.class2life.dto.interaction.*;
import com.class2life.entity.interaction.*;
import com.class2life.entity.user.AdminAuditLog;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.interaction.*;
import com.class2life.repository.audit.AdminAuditLogRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportedContentRepository reportRepository;
    private final LessonQnaRepository qnaRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AdminAuditLogRepository auditRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReportResponse create(CreateReportRequest request) {
        User actor = currentUser();
        ensureTargetExists(request.entityType(), request.entityId());
        if (reportRepository.existsByReporterIdAndReportedEntityTypeAndReportedEntityIdAndStatus(
                actor.getId(), request.entityType().name(), request.entityId(), ReportStatus.PENDING))
            throw new ApiException(ErrorCode.ALREADY_REPORTED, "You already have a pending report on this content");
        ReportedContent report = new ReportedContent();
        report.setReporter(actor);
        report.setReportedEntityType(request.entityType().name());
        report.setReportedEntityId(request.entityId());
        report.setReason(request.reason().trim());
        report.setStatus(ReportStatus.PENDING);
        return response(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public PageResponse<ReportResponse> list(ReportStatus status, Pageable pageable) {
        requireAdmin();
        ReportStatus effective = status == null ? ReportStatus.PENDING : status;
        Pageable safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<ReportedContent> page = reportRepository.findByStatusOrderByCreatedAtAsc(effective, safePageable);
        return PageResponse.of(page.map(this::response));
    }

    @Transactional
    public ReportResponse resolve(UUID reportId, ResolveReportRequest request) {
        User actor = requireAdmin();
        ReportedContent report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ApiException(ErrorCode.REPORT_NOT_FOUND));
        if (report.getStatus() != ReportStatus.PENDING)
            throw new ApiException(ErrorCode.REPORT_ALREADY_RESOLVED);
        ReportAction action = request.action();
        switch (action) {
            case DELETE_CONTENT -> deleteReportedContent(report);
            case WARN_USER -> warnReportedUser(report);
            case DISMISS -> { }
        }
        ReportStatus outcome = action == ReportAction.DISMISS ? ReportStatus.DISMISSED : ReportStatus.RESOLVED;
        LocalDateTime now = LocalDateTime.now();
        report.setStatus(outcome);
        report.setResolvedBy(actor);
        report.setResolvedAt(now);
        // Other reporters' open reports on the same content get the same outcome, so none stay stuck as PENDING
        List<ReportedContent> siblings = reportRepository.findByReportedEntityTypeAndReportedEntityIdAndStatus(
                report.getReportedEntityType(), report.getReportedEntityId(), ReportStatus.PENDING);
        for (ReportedContent sibling : siblings) {
            if (sibling.getId().equals(report.getId())) continue;
            sibling.setStatus(outcome);
            sibling.setResolvedBy(actor);
            sibling.setResolvedAt(now);
        }
        reportRepository.saveAll(siblings);
        // TODO (follow-up): request.note() is accepted but has no column to be stored in yet
        AdminAuditLog log = AdminAuditLog.builder().actor(actor)
                .action("RESOLVE_REPORT:" + action.name()).entityType("reported_contents").entityId(report.getId()).build();
        auditRepository.save(log);
        return response(reportRepository.save(report));
    }

    private void deleteReportedContent(ReportedContent report) {
        switch (report.getReportedEntityType()) {
            case "QNA" -> {
                LessonQna q = qnaRepository.findById(report.getReportedEntityId())
                        .orElseThrow(() -> new ApiException(ErrorCode.QNA_NOT_FOUND));
                List<LessonQna> replies = qnaRepository.findByParentIdOrderByCreatedAtAsc(q.getId());
                qnaRepository.deleteAll(replies);
                qnaRepository.delete(q);
            }
            case "COURSE" -> throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "Course deletion must use CourseService to enforce course lifecycle rules");
            default -> throw new ApiException(ErrorCode.VALIDATION_ERROR, "Unsupported report target");
        }
    }

    private void warnReportedUser(ReportedContent report) {
        User target = switch (report.getReportedEntityType()) {
            case "QNA" -> qnaRepository.findById(report.getReportedEntityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.QNA_NOT_FOUND)).getAuthor();
            case "COURSE" -> courseRepository.findById(report.getReportedEntityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND)).getInstructor();
            default -> throw new ApiException(ErrorCode.VALIDATION_ERROR, "Unsupported report target");
        };
        notificationService.notifyUser(target.getId(), NotificationType.SYSTEM,
                "A report concerning your content was reviewed by an administrator. Please review the platform rules.");
    }

    private void ensureTargetExists(ReportEntityType type, UUID id) {
        switch (type) {
            case QNA -> {
                if (!qnaRepository.existsById(id)) throw new ApiException(ErrorCode.QNA_NOT_FOUND);
            }
            case COURSE -> {
                if (!courseRepository.existsById(id)) throw new ApiException(ErrorCode.COURSE_NOT_FOUND);
            }
        }
    }

    private ReportResponse response(ReportedContent r) {
        User reporter = r.getReporter();
        return new ReportResponse(r.getId(),
                new ReportResponse.Reporter(reporter.getId(), reporter.getFullName()),
                r.getReportedEntityType(), r.getReportedEntityId(), r.getReason(), r.getStatus(),
                r.getCreatedAt(),
                r.getResolvedBy() == null ? null : r.getResolvedBy().getId(),
                r.getResolvedAt());
    }

    private User requireAdmin() {
        User user = currentUser();
        if (user.getRole() != UserRole.ADMIN) throw new ApiException(ErrorCode.FORBIDDEN);
        return user;
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName()))
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}
