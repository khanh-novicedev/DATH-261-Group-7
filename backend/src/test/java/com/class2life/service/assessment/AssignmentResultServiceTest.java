package com.class2life.service.assessment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.class2life.dto.assessment.AssignmentResultsResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizAttempt;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.entity.assessment.Submission;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.ResultMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizAttemptRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;
import com.class2life.repository.assessment.SubmissionRepository;
import com.class2life.repository.user.UserRepository;
import com.class2life.service.enrolment.EnrolmentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AssignmentResultServiceTest {

    private static final String EMAIL = "learner@class2life.com";

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private EnrolmentService enrolmentService;

    @Mock
    private UserRepository userRepository;

    private AssignmentResultService service;

    private final UUID assignmentId = UUID.randomUUID();
    private final UUID courseId = UUID.randomUUID();
    private User user;
    private Assignment assignment;

    @BeforeEach
    void setUp() {
        service = new AssignmentResultService(assignmentRepository, quizAttemptRepository, submissionRepository,
                quizQuestionRepository, enrolmentService, userRepository, new ResultMapper());

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(EMAIL, null, List.of()));

        user = new User();
        user.setId(UUID.randomUUID());

        Course course = new Course();
        course.setId(courseId);
        Lesson lesson = new Lesson();
        lesson.setCourse(course);

        assignment = new Assignment();
        assignment.setId(assignmentId);
        assignment.setLesson(lesson);
        assignment.setPassScore(5);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void loggedInAndEnrolled() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(enrolmentService.isEnrolled(user.getId(), courseId)).thenReturn(true);
    }

    @Test
    void getMyResults_quiz_returnsAttemptsNewestFirstWithMaxScore() {
        assignment.setType(AssignmentType.QUIZ);
        loggedInAndEnrolled();

        QuizQuestion q1 = new QuizQuestion();
        q1.setPoints(4);
        QuizQuestion q2 = new QuizQuestion();
        q2.setPoints(6);
        when(quizQuestionRepository.findByAssignmentId(assignmentId)).thenReturn(List.of(q1, q2));

        QuizAttempt newest = attempt(BigDecimal.valueOf(7));
        QuizAttempt oldest = attempt(BigDecimal.valueOf(3));
        // The repository already sorts newest first; the service must keep that order
        when(quizAttemptRepository.findByAssignmentIdAndUserIdOrderByAttemptedAtDesc(assignmentId, user.getId()))
                .thenReturn(List.of(newest, oldest));

        AssignmentResultsResponse response = service.getMyResults(assignmentId);

        assertEquals(AssignmentType.QUIZ, response.type());
        assertEquals(5, response.passScore());
        assertEquals(2, response.items().size());
        assertEquals(newest.getId(), response.items().get(0).id());
        assertEquals(oldest.getId(), response.items().get(1).id());
        assertEquals(BigDecimal.valueOf(7), response.items().get(0).score());
        assertEquals(10, response.items().get(0).maxScore());
        assertEquals(LocalDateTime.of(2026, 11, 1, 10, 0), response.items().get(0).submittedAt());
        assertNull(response.items().get(0).fileUrl());
        assertNull(response.items().get(0).feedback());
        assertNull(response.items().get(0).gradedAt());
    }

    @Test
    void getMyResults_fileSubmission_returnsFileFieldsAndNoMaxScore() {
        assignment.setType(AssignmentType.FILE_SUBMISSION);
        loggedInAndEnrolled();

        Submission submission = new Submission();
        submission.setId(UUID.randomUUID());
        submission.setFileUrl("http://files/report.pdf");
        submission.setScore(BigDecimal.valueOf(8));
        submission.setFeedback("Good job");
        submission.setGradedAt(LocalDateTime.of(2026, 11, 2, 9, 0));
        when(submissionRepository.findByAssignmentIdAndUserIdOrderBySubmittedAtDesc(assignmentId, user.getId()))
                .thenReturn(List.of(submission));

        AssignmentResultsResponse response = service.getMyResults(assignmentId);

        assertEquals(AssignmentType.FILE_SUBMISSION, response.type());
        assertEquals(1, response.items().size());
        assertEquals("http://files/report.pdf", response.items().get(0).fileUrl());
        assertEquals("Good job", response.items().get(0).feedback());
        assertEquals(LocalDateTime.of(2026, 11, 2, 9, 0), response.items().get(0).gradedAt());
        assertEquals(BigDecimal.valueOf(8), response.items().get(0).score());
        assertNull(response.items().get(0).maxScore());
    }

    @Test
    void getMyResults_notEnrolled_throwsNotEnrolled() {
        assignment.setType(AssignmentType.QUIZ);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(enrolmentService.isEnrolled(user.getId(), courseId)).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class, () -> service.getMyResults(assignmentId));

        assertEquals(ErrorCode.NOT_ENROLLED, ex.getErrorCode());
    }

    @Test
    void getMyResults_assignmentNotFound_throwsAssignmentNotFound() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> service.getMyResults(assignmentId));

        assertEquals(ErrorCode.ASSIGNMENT_NOT_FOUND, ex.getErrorCode());
    }

    // QuizAttempt has no setters for id and attemptedAt (set by the database), so the test sets them directly
    private QuizAttempt attempt(BigDecimal score) {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setId(UUID.randomUUID());
        attempt.setTotalScore(score);
        ReflectionTestUtils.setField(attempt, "attemptedAt", LocalDateTime.of(2026, 11, 1, 10, 0));
        return attempt;
    }
}
