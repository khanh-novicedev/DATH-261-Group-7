package com.class2life.service.interaction;

import com.class2life.dto.interaction.*;
/*import com.class2life.entity.course.Course;
import com.class2life.entity.course.Lesson;
*/
import com.class2life.entity.interaction.*;
import com.class2life.entity.user.AdminAuditLog;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.interaction.*;
import com.class2life.repository.user.AdminAuditLogRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportedContentRepository reportRepository;
    private final LessonQnaRepository qnaRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AdminAuditLogRepository auditRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReportResponse create(CreateReportRequest request) {
        User actor = currentUser();
        String type = request.reportedEntityType().trim().toUpperCase(Locale.ROOT);
        if (!List.of("QNA", "LESSON", "COURSE").contains(type))
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "reportedEntityType must be QNA, LESSON, or COURSE");
        ensureTargetExists(type, request.reportedEntityId());
        ReportedContent report = new ReportedContent();
        report.setReporter(actor);
        report.setReportedEntityType(type);
        report.setReportedEntityId(request.reportedEntityId());
        report.setReason(request.reason().trim());
        report.setStatus(ReportStatus.PENDING);
        return response(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> list() {
        requireAdmin();
        return reportRepository.findAllByOrderByCreatedAtDesc().stream().map(this::response).toList();
    }

    @Transactional
    public ReportResponse resolve(UUID reportId, ResolveReportRequest request) {
        User actor = requireAdmin();
        ReportedContent report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ApiException(ErrorCode.REPORT_NOT_FOUND));
        if (report.getStatus() != ReportStatus.PENDING)
            throw new ApiException(ErrorCode.REPORT_ALREADY_RESOLVED);
        String action = request.action().trim().toUpperCase(Locale.ROOT);
        switch (action) {
            case "DELETE_CONTENT" -> deleteReportedContent(report);
            case "WARN_USER" -> warnReportedUser(report);
            case "DISMISS" -> report.setStatus(ReportStatus.DISMISSED);
            default -> throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "action must be DELETE_CONTENT, WARN_USER, or DISMISS");
        }
        if (!"DISMISS".equals(action)) report.setStatus(ReportStatus.RESOLVED);
        report.setResolvedBy(actor);
        report.setResolvedAt(LocalDateTime.now());
        AdminAuditLog log = AdminAuditLog.builder().actorId(actor)
                .action("RESOLVE_REPORT:" + action).entityType("reported_contents").entityId(report.getId()).build();
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
            case "LESSON" -> throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "Lesson deletion is not implemented because it may invalidate enrolment progress and assignments");
            case "COURSE" -> throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "Course deletion must use CourseService to enforce course lifecycle rules");
            default -> throw new ApiException(ErrorCode.VALIDATION_ERROR, "Unsupported report target");
        }
    }

    private void warnReportedUser(ReportedContent report) {
        User target = switch (report.getReportedEntityType()) {
            case "QNA" -> qnaRepository.findById(report.getReportedEntityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.QNA_NOT_FOUND)).getAuthor();
            case "LESSON" -> lessonRepository.findById(report.getReportedEntityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.LESSON_NOT_FOUND)).getCourse().getInstructor();
            case "COURSE" -> courseRepository.findById(report.getReportedEntityId())
                    .orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND)).getInstructor();
            default -> throw new ApiException(ErrorCode.VALIDATION_ERROR);
        };
        notificationService.notifyUser(target.getId(), NotificationType.SYSTEM,
                "A report concerning your content was reviewed by an administrator. Please review the platform rules.");
    }

    private void ensureTargetExists(String type, UUID id) {
        boolean exists = switch (type) {
            case "QNA" -> qnaRepository.existsById(id);
            case "LESSON" -> lessonRepository.existsById(id);
            case "COURSE" -> courseRepository.existsById(id);
            default -> false;
        };
        if (!exists) throw new ApiException(ErrorCode.VALIDATION_ERROR, "Reported content was not found");
    }

    private ReportResponse response(ReportedContent r) {
        return new ReportResponse(r.getId(), r.getReporter().getId(), r.getReportedEntityType(),
                r.getReportedEntityId(), r.getReason(), r.getStatus(),
                r.getResolvedBy() == null ? null : r.getResolvedBy().getId(),
                r.getCreatedAt(), r.getResolvedAt());
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
