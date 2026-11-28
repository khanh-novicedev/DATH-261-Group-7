package com.class2life.service.assessment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.class2life.dto.assessment.AssignmentResponse;
import com.class2life.dto.assessment.CreateAssignmentRequest;
import com.class2life.dto.assessment.CreateQuizOptionRequest;
import com.class2life.dto.assessment.CreateQuizQuestionRequest;
import com.class2life.dto.assessment.QuizOptionResponse;
import com.class2life.dto.assessment.QuizQuestionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.AssignmentMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizAttemptRepository;
import com.class2life.repository.assessment.QuizOptionRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;
import com.class2life.repository.assessment.SubmissionRepository;
import com.class2life.repository.user.UserRepository;
import com.class2life.entity.course.Course;
import com.class2life.service.course.CourseService;
import com.class2life.service.enrolment.EnrolmentService;

import java.util.Arrays;
import java.util.Collections;
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

@ExtendWith(MockitoExtension.class)
class AssignmentServiceTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private QuizOptionRepository quizOptionRepository;

    @Mock
    private CourseService courseService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrolmentService enrolmentService;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    private AssignmentService assignmentService;

    private final UUID lessonId = UUID.randomUUID();
    private final UUID instructorId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        // The real mapper is used on purpose: it has no logic that needs mocking
        assignmentService = new AssignmentService(assignmentRepository, quizQuestionRepository,
                quizOptionRepository, courseService, new AssignmentMapper(), userRepository, enrolmentService,
                submissionRepository, quizAttemptRepository);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // Puts a logged-in user with this role into the SecurityContext, as the JWT filter would
    private void loginAs(UserRole role) {
        String email = role.name().toLowerCase() + "@class2life.com";
        User user = new User();
        user.setId(instructorId);
        user.setEmail(email);
        user.setRole(role);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList()));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
    }

    private final UUID courseId = UUID.randomUUID();

    private Lesson lesson() {
        Course course = new Course();
        course.setId(courseId);
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);
        return lesson;
    }

    private Assignment quizAssignment(UUID assignmentId) {
        Assignment assignment = new Assignment();
        assignment.setId(assignmentId);
        assignment.setType(AssignmentType.QUIZ);
        assignment.setLesson(lesson());
        return assignment;
    }

    private CreateAssignmentRequest quizRequest(Integer passScore, List<CreateQuizOptionRequest> options) {
        CreateQuizQuestionRequest question = new CreateQuizQuestionRequest("What is feedback?", 2, options);
        return new CreateAssignmentRequest("Quiz 1", AssignmentType.QUIZ, "Answer all", passScore, null, List.of(question));
    }

    @Test
    void createAssignment_Quiz_Success() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(true);
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateAssignmentRequest request = quizRequest(2, List.of(
                new CreateQuizOptionRequest("Information about performance", true),
                new CreateQuizOptionRequest("A punishment", false)));

        AssignmentResponse response = assignmentService.createAssignment(lessonId, request);

        assertEquals("Quiz 1", response.title());
        assertEquals(AssignmentType.QUIZ, response.type());
        assertEquals(lessonId, response.lessonId());
        verify(quizQuestionRepository, times(1)).saveAll(any());
        verify(quizOptionRepository, times(1)).saveAll(any());
    }

    @Test
    void createAssignment_Quiz_NoCorrectOption_ThrowsValidationError() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(true);

        CreateAssignmentRequest request = quizRequest(null, List.of(
                new CreateQuizOptionRequest("Wrong A", false),
                new CreateQuizOptionRequest("Wrong B", false)));

        ApiException exception = assertThrows(ApiException.class,
                () -> assignmentService.createAssignment(lessonId, request));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }

    @Test
    void createAssignment_Quiz_PassScoreAboveTotalPoints_ThrowsValidationError() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(true);

        // The only question is worth 2 points, so a pass score of 5 can never be reached
        CreateAssignmentRequest request = quizRequest(5, List.of(
                new CreateQuizOptionRequest("Right", true),
                new CreateQuizOptionRequest("Wrong", false)));

        ApiException exception = assertThrows(ApiException.class,
                () -> assignmentService.createAssignment(lessonId, request));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }

    @Test
    void createAssignment_FileSubmissionWithQuestions_ThrowsTypeMismatch() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(true);

        CreateQuizQuestionRequest question = new CreateQuizQuestionRequest("Q", 1, List.of(
                new CreateQuizOptionRequest("A", true), new CreateQuizOptionRequest("B", false)));
        CreateAssignmentRequest request = new CreateAssignmentRequest(
                "Essay", AssignmentType.FILE_SUBMISSION, "Upload your essay", null, null, List.of(question));

        ApiException exception = assertThrows(ApiException.class,
                () -> assignmentService.createAssignment(lessonId, request));

        assertEquals(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, exception.getErrorCode());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }

    @Test
    void createAssignment_NotOwner_ThrowsForbidden() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(false);

        CreateAssignmentRequest request = quizRequest(null, List.of(
                new CreateQuizOptionRequest("A", true), new CreateQuizOptionRequest("B", false)));

        ApiException exception = assertThrows(ApiException.class,
                () -> assignmentService.createAssignment(lessonId, request));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }

    @Test
    void createAssignment_Learner_ThrowsForbiddenBeforeAnyLookup() {
        loginAs(UserRole.LEARNER);

        CreateAssignmentRequest request = quizRequest(null, List.of(
                new CreateQuizOptionRequest("A", true), new CreateQuizOptionRequest("B", false)));

        ApiException exception = assertThrows(ApiException.class,
                () -> assignmentService.createAssignment(lessonId, request));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
        verify(courseService, never()).getLessonOrThrow(any());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }

    @Test
    void getQuizQuestions_Success_NeverExposesCorrectFlag() {
        loginAs(UserRole.LEARNER);
        UUID assignmentId = UUID.randomUUID();
        Assignment assignment = quizAssignment(assignmentId);
        when(enrolmentService.isEnrolled(instructorId, courseId)).thenReturn(true);

        QuizQuestion question = new QuizQuestion();
        question.setId(UUID.randomUUID());
        question.setContent("Question 1");
        question.setPoints(3);

        QuizOption correctOption = new QuizOption();
        correctOption.setId(UUID.randomUUID());
        correctOption.setQuestion(question);
        correctOption.setContent("Right answer");
        correctOption.setIsCorrect(true);

        QuizOption wrongOption = new QuizOption();
        wrongOption.setId(UUID.randomUUID());
        wrongOption.setQuestion(question);
        wrongOption.setContent("Wrong answer");

        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(quizQuestionRepository.findByAssignmentIdOrderByIdAsc(assignmentId)).thenReturn(List.of(question));
        when(quizOptionRepository.findByQuestionAssignmentIdOrderByIdAsc(assignmentId)).thenReturn(List.of(correctOption, wrongOption));

        List<QuizQuestionResponse> result = assignmentService.getQuizQuestions(assignmentId);

        assertEquals(1, result.size());
        assertEquals(2, result.get(0).options().size());

        // The learner-facing option DTO must not have any component that reveals the answer
        boolean exposesCorrectFlag = Arrays.stream(QuizOptionResponse.class.getRecordComponents())
                .anyMatch(component -> component.getName().toLowerCase().contains("correct"));
        assertTrue(!exposesCorrectFlag, "QuizOptionResponse must not expose is_correct");
    }

    @Test
    void getQuizQuestions_LearnerNotEnrolled_ThrowsNotEnrolled() {
        loginAs(UserRole.LEARNER);
        UUID assignmentId = UUID.randomUUID();
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(quizAssignment(assignmentId)));
        when(enrolmentService.isEnrolled(instructorId, courseId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getQuizQuestions(assignmentId));

        assertEquals(ErrorCode.NOT_ENROLLED, exception.getErrorCode());
        verify(quizQuestionRepository, never()).findByAssignmentIdOrderByIdAsc(any());
    }

    @Test
    void getQuizQuestions_Instructor_ThrowsForbidden() {
        loginAs(UserRole.INSTRUCTOR);
        UUID assignmentId = UUID.randomUUID();
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(quizAssignment(assignmentId)));

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getQuizQuestions(assignmentId));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }

    @Test
    void getAssignmentsByLesson_LearnerNotEnrolled_ThrowsNotEnrolled() {
        loginAs(UserRole.LEARNER);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(enrolmentService.isEnrolled(instructorId, courseId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getAssignmentsByLesson(lessonId));

        assertEquals(ErrorCode.NOT_ENROLLED, exception.getErrorCode());
        verify(assignmentRepository, never()).findByLessonIdOrderByCreatedAtAsc(any());
    }

    @Test
    void getAssignmentsByLesson_OtherInstructor_ThrowsForbidden() {
        loginAs(UserRole.INSTRUCTOR);
        when(courseService.getLessonOrThrow(lessonId)).thenReturn(lesson());
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getAssignmentsByLesson(lessonId));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }

    @Test
    void getQuizQuestions_NotAQuiz_ThrowsTypeMismatch() {
        UUID assignmentId = UUID.randomUUID();
        Assignment assignment = new Assignment();
        assignment.setId(assignmentId);
        assignment.setType(AssignmentType.FILE_SUBMISSION);
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getQuizQuestions(assignmentId));

        assertEquals(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, exception.getErrorCode());
    }

    @Test
    void getQuizQuestions_NotFound_ThrowsAssignmentNotFound() {
        UUID assignmentId = UUID.randomUUID();
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class, () -> assignmentService.getQuizQuestions(assignmentId));

        assertEquals(ErrorCode.ASSIGNMENT_NOT_FOUND, exception.getErrorCode());
    }
}