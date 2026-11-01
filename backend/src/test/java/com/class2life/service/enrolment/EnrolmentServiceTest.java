package com.class2life.service.enrolment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.class2life.dto.enrolment.EnrolmentResponse;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.enrolment.CompletionStatus;
import com.class2life.entity.enrolment.Enrolment;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class EnrolmentServiceTest {
    private static final String EMAIL = "learner@class2life.com";

    @Mock
    private EnrolmentRepository enrolmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EnrolmentService enrolmentService;

    private User learner;
    private Course course;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(EMAIL, null, List.of(new SimpleGrantedAuthority("ROLE_LEARNER"))));
        learner = new User();
        learner.setId(UUID.randomUUID());
        learner.setEmail(EMAIL);
        learner.setRole(UserRole.LEARNER);
        learner.setStatus(UserStatus.ACTIVE);

        course = new Course();
        course.setId(UUID.randomUUID());
        course.setTitle("Public Speaking");
        course.setStatus(CourseStatus.PUBLISHED);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void enrol_Success() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrolmentRepository.existsByUserIdAndCourseId(learner.getId(), course.getId())).thenReturn(false);
        when(enrolmentRepository.saveAndFlush(any(Enrolment.class))).thenAnswer(invocation -> {
            Enrolment saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            saved.setEnrolledAt(LocalDateTime.of(2026, 11, 1, 9, 0));
            return saved;
        });

        EnrolmentResponse result = enrolmentService.enrol(course.getId());

        assertEquals(course.getId(), result.courseId());
        assertEquals(CompletionStatus.IN_PROGRESS, result.completionStatus());
        assertEquals(LocalDateTime.of(2026, 11, 1, 9, 0), result.enrolledAt());
        assertEquals(36, result.enrolmentId().toString().length());
    }

    @Test
    void enrol_AlreadyEnrolled_Throws409() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrolmentRepository.existsByUserIdAndCourseId(learner.getId(), course.getId())).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> enrolmentService.enrol(course.getId()));

        assertEquals(ErrorCode.ALREADY_ENROLLED, ex.getErrorCode());
        verify(enrolmentRepository, never()).saveAndFlush(any());
    }

    @Test
    void enrol_ConcurrentDuplicate_Throws409() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrolmentRepository.existsByUserIdAndCourseId(learner.getId(), course.getId())).thenReturn(false);
        when(enrolmentRepository.saveAndFlush(any(Enrolment.class)))
                .thenThrow(new DataIntegrityViolationException("uq_enrolments_user_course"));

        ApiException ex = assertThrows(ApiException.class, () -> enrolmentService.enrol(course.getId()));

        assertEquals(ErrorCode.ALREADY_ENROLLED, ex.getErrorCode());
    }

    @Test
    void enrol_CourseNotPublished_Throws400() {
        course.setStatus(CourseStatus.DRAFT);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));

        ApiException ex = assertThrows(ApiException.class, () -> enrolmentService.enrol(course.getId()));

        assertEquals(ErrorCode.COURSE_NOT_PUBLISHED, ex.getErrorCode());
    }

    @Test
    void enrol_CourseNotFound_Throws404() {
        UUID missing = UUID.randomUUID();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(missing)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> enrolmentService.enrol(missing));

        assertEquals(ErrorCode.COURSE_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void enrol_NotALearner_Throws403() {
        learner.setRole(UserRole.INSTRUCTOR);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(learner));

        ApiException ex = assertThrows(ApiException.class, () -> enrolmentService.enrol(course.getId()));

        assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
        verify(courseRepository, never()).findById(any());
    }
}
