package com.class2life.service.enrolment;

import com.class2life.dto.enrolment.*;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.enrolment.*;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.enrolment.LessonProgressRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
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
        if (user.getRole() != UserRole.LEARNER) throw new ApiException(ErrorCode.FORBIDDEN, "Only learners can enrol");
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND));
        if (course.getStatus() != CourseStatus.PUBLISHED) throw new ApiException(ErrorCode.COURSE_NOT_PUBLISHED);
        if (isEnrolled(user.getId(), courseId)) throw new ApiException(ErrorCode.ALREADY_ENROLLED);
        Enrolment e = new Enrolment();
        e.setUser(user); e.setCourse(course); e.setCompletionStatus(CompletionStatus.IN_PROGRESS);
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

    @Transactional(readOnly = true)
    public List<EnrolmentResponse> myEnrolments() {
        User user = currentUser();
        return enrolmentRepository.findByUserIdOrderByEnrolledAtDesc(user.getId()).stream()
                .map(this::toEnrolmentResponse).toList();
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
    public CourseProgressResponse getProgress(UUID courseId, UUID requestedUserId) {
        User actor = currentUser();
        UUID learnerId = requestedUserId == null ? actor.getId() : requestedUserId;
        Enrolment enrolment = enrolmentRepository.findByUserIdAndCourseId(learnerId, courseId)
                .orElseThrow(() -> new ApiException(ErrorCode.ENROLMENT_NOT_FOUND));
        if (!actor.getId().equals(learnerId)) {
            Course course = enrolment.getCourse();
            boolean allowed = actor.getRole() == UserRole.ADMIN ||
                    (actor.getRole() == UserRole.INSTRUCTOR && course.getInstructor().getId().equals(actor.getId()));
            if (!allowed) throw new ApiException(ErrorCode.FORBIDDEN);
        }
        return progressFor(enrolment, lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId));
    }

    @Transactional(readOnly = true)
    public List<CourseMetricsResponse> courseMetrics() {
        User actor = currentUser();
        if (actor.getRole() != UserRole.ADMIN && actor.getRole() != UserRole.INSTRUCTOR)
            throw new ApiException(ErrorCode.FORBIDDEN);
        List<Course> courses = courseRepository.findAll().stream()
                .filter(c -> actor.getRole() == UserRole.ADMIN || c.getInstructor().getId().equals(actor.getId()))
                .toList();
        return courses.stream().map(c -> {
            List<Enrolment> enrolments = enrolmentRepository.findByCourseId(c.getId());
            long completed = enrolments.stream().filter(e -> e.getCompletionStatus() == CompletionStatus.COMPLETED).count();
            double rate = enrolments.isEmpty() ? 0.0 : completed * 100.0 / enrolments.size();
            return new CourseMetricsResponse(c.getId(), c.getTitle(), enrolments.size(), completed, rate);
        }).toList();
    }

    private CourseProgressResponse progressFor(Enrolment e, List<Lesson> lessons) {
        Map<UUID, LessonProgress> byLesson = new HashMap<>();
        for (LessonProgress p : lessonProgressRepository.findByEnrolmentId(e.getId())) byLesson.put(p.getLesson().getId(), p);
        List<LessonProgressResponse> rows = lessons.stream().map(l -> {
            LessonProgress p = byLesson.get(l.getId());
            return new LessonProgressResponse(l.getId(), l.getTitle(), l.getSequenceNumber(),
                    p != null && Boolean.TRUE.equals(p.getIsCompleted()), p == null ? null : p.getCompletedAt());
        }).toList();
        long done = rows.stream().filter(LessonProgressResponse::completed).count();
        double pct = lessons.isEmpty() ? 0 : done * 100.0 / lessons.size();
        return new CourseProgressResponse(e.getCourse().getId(), e.getCourse().getTitle(), e.getCompletionStatus(), done, lessons.size(), pct, rows);
    }

    private EnrolmentResponse toEnrolmentResponse(Enrolment e) {
        long total = lessonRepository.countByCourseId(e.getCourse().getId());
        long done = lessonProgressRepository.countByEnrolmentIdAndIsCompletedTrue(e.getId());
        return new EnrolmentResponse(e.getId(), e.getCourse().getId(), e.getCourse().getTitle(),
                e.getCompletionStatus(), e.getLastPositionLesson() == null ? null : e.getLastPositionLesson().getId(),
                e.getEnrolledAt(), done, total);
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().equals("anonymousUser"))
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}


/*package com.class2life.service.enrolment;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    public boolean isEnrolled(UUID userId, UUID courseId) {
        return enrolmentService.isEnrolled(userId, courseId);
    }
}*/