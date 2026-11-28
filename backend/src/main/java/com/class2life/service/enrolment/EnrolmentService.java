package com.class2life.service.enrolment;

import com.class2life.common.PageResponse;
import com.class2life.dto.enrolment.*;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.enrolment.*;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.enrolment.LessonProgressRepository;
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
import java.util.*;

@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public boolean isEnrolled(UUID userId, UUID courseId) {
        return enrolmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Transactional
    public EnrolmentResponse enrol(UUID courseId) {
        User user = currentUser();
        if (user.getStatus() == UserStatus.SUSPENDED) throw new ApiException(ErrorCode.ACCOUNT_SUSPENDED, "Account suspended");
        if (user.getRole() != UserRole.LEARNER) throw new ApiException(ErrorCode.FORBIDDEN, "Only learners can enrol");
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getStatus() != CourseStatus.PUBLISHED) throw new ApiException(ErrorCode.COURSE_NOT_PUBLISHED);
        if (isEnrolled(user.getId(), courseId)) throw new ApiException(ErrorCode.ALREADY_ENROLLED);
        Enrolment e = new Enrolment();
        e.setUser(user); e.setCourse(course);
        e.setCompletionStatus(CompletionStatus.IN_PROGRESS);
        e = enrolmentRepository.save(e);
        for (Lesson lesson : lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId)) {
            LessonProgress p = new LessonProgress(); p.setEnrolment(e); p.setLesson(lesson); p.setIsCompleted(false);
            lessonProgressRepository.save(p);
        }
        return toEnrolmentResponse(e);
    }

    @Transactional
    public void unenrol(UUID courseId) {
        User user = currentUser();
        Enrolment e = enrolmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new ApiException(ErrorCode.ENROLMENT_NOT_FOUND));
        lessonProgressRepository.deleteByEnrolmentId(e.getId());
        enrolmentRepository.delete(e);
    }

    // API-21: paged, optional status filter. Counts are batched per page (2 queries), not per row.
    @Transactional(readOnly = true)
    public PageResponse<EnrolmentResponse> myEnrolments(CompletionStatus status, Pageable pageable) {
        User user = currentUser();
        Pageable safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<Enrolment> page = status == null
                ? enrolmentRepository.findByUserIdOrderByEnrolledAtDesc(user.getId(), safePageable)
                : enrolmentRepository.findByUserIdAndCompletionStatusOrderByEnrolledAtDesc(user.getId(), status, safePageable);
        if (page.isEmpty()) return PageResponse.of(page.map(e -> toEnrolmentResponse(e)));

        List<UUID> courseIds = page.getContent().stream().map(e -> e.getCourse().getId()).distinct().toList();
        List<UUID> enrolmentIds = page.getContent().stream().map(Enrolment::getId).toList();
        Map<UUID, Long> lessonsByCourse = toCountMap(lessonRepository.countByCourseIds(courseIds));
        Map<UUID, Long> completedByEnrolment = toCountMap(lessonProgressRepository.countCompletedByEnrolmentIds(enrolmentIds));

        return PageResponse.of(page.map(e -> EnrolmentResponse.from(e,
                completedByEnrolment.getOrDefault(e.getId(), 0L),
                lessonsByCourse.getOrDefault(e.getCourse().getId(), 0L))));
    }

    private static Map<UUID, Long> toCountMap(List<Object[]> rows) {
        Map<UUID, Long> counts = new HashMap<>();
        for (Object[] row : rows) counts.put((UUID) row[0], ((Number) row[1]).longValue());
        return counts;
    }

    @Transactional
    public CourseProgressResponse updateProgress(UUID courseId, UUID lessonId, boolean completed) {
        User user = currentUser();
        Enrolment enrolment = enrolmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_ENROLLED));
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new ApiException(ErrorCode.LESSON_NOT_FOUND));
        if (!lesson.getCourse().getId().equals(courseId)) throw new ApiException(ErrorCode.VALIDATION_ERROR, "Lesson does not belong to this course");
        enrolment.setLastPositionLesson(lesson);
        LessonProgress progress = lessonProgressRepository.findByEnrolmentIdAndLessonId(enrolment.getId(), lessonId)
                .orElseGet(() -> { LessonProgress p = new LessonProgress(); p.setEnrolment(enrolment); p.setLesson(lesson); return p; });
        progress.setIsCompleted(completed);
        progress.setCompletedAt(completed ? LocalDateTime.now() : null);
        lessonProgressRepository.save(progress);

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId);
        long completedCount = lessonProgressRepository.countByEnrolmentIdAndIsCompletedTrue(enrolment.getId());
        enrolment.setCompletionStatus(!lessons.isEmpty() && completedCount >= lessons.size()
                ? CompletionStatus.COMPLETED : CompletionStatus.IN_PROGRESS);
        enrolmentRepository.save(enrolment);
        return progressFor(enrolment, lessons);
    }

    @Transactional(readOnly = true)
    public CourseProgressResponse getProgress(UUID courseId) {
        User user = currentUser();
        Enrolment enrolment = enrolmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new ApiException(ErrorCode.ENROLMENT_NOT_FOUND));
        return progressFor(enrolment, lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId));
    }

    // API-24: paged, optional courseId. Filtering happens in SQL (not findAll + stream filter);
    // counts are batched per page (2 grouped queries), not one enrolment load per course.
    @Transactional(readOnly = true)
    public PageResponse<CourseMetricsResponse> courseMetrics(UUID courseId, Pageable pageable) {
        User actor = currentUser();
        if (actor.getRole() != UserRole.ADMIN && actor.getRole() != UserRole.INSTRUCTOR)
            throw new ApiException(ErrorCode.FORBIDDEN);
        UUID instructorId = actor.getRole() == UserRole.ADMIN ? null : actor.getId();
        if (courseId != null) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND));
            if (instructorId != null && !course.getInstructor().getId().equals(instructorId))
                throw new ApiException(ErrorCode.FORBIDDEN);
        }
        Pageable safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        Page<Course> page = courseRepository.findForMetrics(instructorId, courseId, safePageable);

        List<UUID> courseIds = page.getContent().stream().map(Course::getId).toList();
        Map<UUID, Long> enrolledByCourse = courseIds.isEmpty() ? Map.of()
                : toCountMap(enrolmentRepository.countByCourseIds(courseIds));
        Map<UUID, Long> completedByCourse = courseIds.isEmpty() ? Map.of()
                : toCountMap(enrolmentRepository.countByCourseIdsAndStatus(courseIds, CompletionStatus.COMPLETED));

        return PageResponse.of(page.map(c -> {
            long enrolled = enrolledByCourse.getOrDefault(c.getId(), 0L);
            long completed = completedByCourse.getOrDefault(c.getId(), 0L);
            double rate = enrolled == 0 ? 0.0 : (double) completed / enrolled;
            return new CourseMetricsResponse(c.getId(), c.getTitle(), enrolled, completed, rate);
        }));
    }

    private CourseProgressResponse progressFor(Enrolment e, List<Lesson> lessons) {
        Map<UUID, LessonProgress> byLesson = new HashMap<>();
        for (LessonProgress p : lessonProgressRepository.findByEnrolmentId(e.getId())) byLesson.put(p.getLesson().getId(), p);
        List<LessonProgressResponse> rows = lessons.stream().map(l -> {
            LessonProgress p = byLesson.get(l.getId());
            return new LessonProgressResponse(l.getId(), l.getTitle(), l.getSequenceNumber(),
                    p != null && Boolean.TRUE.equals(p.getIsCompleted()), p == null ? null : p.getCompletedAt());
        }).toList();
        long done = rows.stream().filter(LessonProgressResponse::isCompleted).count();
        int percent = lessons.isEmpty() ? 0 : (int) (done * 100 / lessons.size());
        Lesson last = e.getLastPositionLesson();
        return new CourseProgressResponse(e.getCourse().getId(), e.getUser().getId(), e.getCourse().getTitle(),
                e.getCompletionStatus(), done, lessons.size(), percent,
                last == null ? null : last.getId(), rows);
    }

    private EnrolmentResponse toEnrolmentResponse(Enrolment e) {
        long total = lessonRepository.countByCourseId(e.getCourse().getId());
        long done = lessonProgressRepository.countByEnrolmentIdAndIsCompletedTrue(e.getId());
        return EnrolmentResponse.from(e, done, total);
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().equals("anonymousUser"))
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}
