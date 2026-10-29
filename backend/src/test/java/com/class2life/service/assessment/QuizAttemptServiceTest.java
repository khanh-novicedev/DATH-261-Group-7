package com.class2life.service.assessment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.class2life.common.PageResponse;
import com.class2life.dto.assessment.QuizAnswerRequest;
import com.class2life.dto.assessment.QuizAttemptResponse;
import com.class2life.dto.assessment.SubmitQuizAttemptRequest;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizAttempt;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.QuizMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizAttemptRepository;
import com.class2life.repository.assessment.QuizOptionRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class QuizAttemptServiceTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private QuizOptionRepository quizOptionRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private UserReferenceProvider userReferenceProvider;

    private QuizAttemptService quizAttemptService;

    private final UUID assignmentId = UUID.randomUUID();
    private final UUID userId = UUID.randomUUID();

    // Quiz fixture: question 1 (2 points) has one correct option, question 2 (3 points) has two correct options
    private Assignment assignment;
    private QuizQuestion question1;
    private QuizQuestion question2;
    private QuizOption q1Right;
    private QuizOption q1Wrong;
    private QuizOption q2RightA;
    private QuizOption q2RightB;
    private QuizOption q2Wrong;

    @BeforeEach
    void setUp() {
        quizAttemptService = new QuizAttemptService(assignmentRepository, quizQuestionRepository,
                quizOptionRepository, quizAttemptRepository, userReferenceProvider, new QuizMapper());

        assignment = new Assignment();
        assignment.setId(assignmentId);
        assignment.setType(AssignmentType.QUIZ);
        assignment.setPassScore(4);

        question1 = question(2);
        question2 = question(3);
        q1Right = option(question1, true);
        q1Wrong = option(question1, false);
        q2RightA = option(question2, true);
        q2RightB = option(question2, true);
        q2Wrong = option(question2, false);
    }

    private QuizQuestion question(int points) {
        QuizQuestion question = new QuizQuestion();
        question.setId(UUID.randomUUID());
        question.setPoints(points);
        return question;
    }

    private QuizOption option(QuizQuestion question, boolean correct) {
        QuizOption option = new QuizOption();
        option.setId(UUID.randomUUID());
        option.setQuestion(question);
        option.setIsCorrect(correct);
        return option;
    }

    private void stubQuizContent() {
        when(quizQuestionRepository.findByAssignmentId(assignmentId)).thenReturn(List.of(question1, question2));
        when(quizOptionRepository.findByQuestionAssignmentId(assignmentId))
                .thenReturn(List.of(q1Right, q1Wrong, q2RightA, q2RightB, q2Wrong));
    }

    private void stubSave() {
        User user = new User();
        user.setId(userId);
        when(userReferenceProvider.getReference(userId)).thenReturn(user);
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void submitAttempt_AllCorrect_FullScoreAndPassed() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();
        stubSave();

        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId())),
                new QuizAnswerRequest(question2.getId(), List.of(q2RightA.getId(), q2RightB.getId()))));

        QuizAttemptResponse response = quizAttemptService.submitAttempt(assignmentId, userId, request);

        assertEquals(0, new BigDecimal("5").compareTo(response.totalScore()));
        assertEquals(5, response.maxScore());
        assertTrue(response.passed());
    }

    @Test
    void submitAttempt_PartialMultiSelect_EarnsNoPointsForThatQuestion() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();
        stubSave();

        // Question 2 needs both correct options; selecting only one earns nothing
        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId())),
                new QuizAnswerRequest(question2.getId(), List.of(q2RightA.getId()))));

        QuizAttemptResponse response = quizAttemptService.submitAttempt(assignmentId, userId, request);

        assertEquals(0, new BigDecimal("2").compareTo(response.totalScore()));
        assertFalse(response.passed());
    }

    @Test
    void submitAttempt_SelectingAWrongExtraOption_EarnsNoPoints() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();
        stubSave();

        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId(), q1Wrong.getId())),
                new QuizAnswerRequest(question2.getId(), List.of(q2RightA.getId(), q2RightB.getId()))));

        QuizAttemptResponse response = quizAttemptService.submitAttempt(assignmentId, userId, request);

        assertEquals(0, new BigDecimal("3").compareTo(response.totalScore()));
    }

    @Test
    void submitAttempt_UnansweredQuestionScoresZero() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();
        stubSave();

        // Only question 1 is answered; question 2 is left out
        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId()))));

        QuizAttemptResponse response = quizAttemptService.submitAttempt(assignmentId, userId, request);

        assertEquals(0, new BigDecimal("2").compareTo(response.totalScore()));
    }

    @Test
    void submitAttempt_DeadlinePassed_ThrowsDeadlinePassed() {
        assignment.setDeadline(LocalDateTime.now().minusDays(1));
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId()))));

        ApiException exception = assertThrows(ApiException.class,
                () -> quizAttemptService.submitAttempt(assignmentId, userId, request));

        assertEquals(ErrorCode.DEADLINE_PASSED, exception.getErrorCode());
        verify(quizAttemptRepository, never()).save(any(QuizAttempt.class));
    }

    @Test
    void submitAttempt_NotAQuiz_ThrowsTypeMismatch() {
        assignment.setType(AssignmentType.FILE_SUBMISSION);
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId()))));

        ApiException exception = assertThrows(ApiException.class,
                () -> quizAttemptService.submitAttempt(assignmentId, userId, request));

        assertEquals(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, exception.getErrorCode());
    }

    @Test
    void submitAttempt_OptionFromAnotherQuestion_ThrowsValidationError() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();

        // q2RightA belongs to question 2, not to question 1
        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q2RightA.getId()))));

        ApiException exception = assertThrows(ApiException.class,
                () -> quizAttemptService.submitAttempt(assignmentId, userId, request));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
        verify(quizAttemptRepository, never()).save(any(QuizAttempt.class));
    }

    @Test
    void submitAttempt_DuplicateAnswerForSameQuestion_ThrowsValidationError() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        stubQuizContent();

        SubmitQuizAttemptRequest request = new SubmitQuizAttemptRequest(List.of(
                new QuizAnswerRequest(question1.getId(), List.of(q1Right.getId())),
                new QuizAnswerRequest(question1.getId(), List.of(q1Wrong.getId()))));

        ApiException exception = assertThrows(ApiException.class,
                () -> quizAttemptService.submitAttempt(assignmentId, userId, request));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
    }

    @Test
    void getAttemptHistory_Success() {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setId(UUID.randomUUID());
        attempt.setAssignment(assignment);
        attempt.setTotalScore(new BigDecimal("5"));

        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(quizQuestionRepository.findByAssignmentId(assignmentId)).thenReturn(List.of(question1, question2));
        when(quizAttemptRepository.findByAssignmentIdAndUserId(eq(assignmentId), eq(userId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(attempt)));

        PageResponse<QuizAttemptResponse> result = quizAttemptService.getAttemptHistory(assignmentId, userId, 0, 10);

        assertEquals(1, result.items().size());
        assertEquals(5, result.items().get(0).maxScore());
        assertTrue(result.items().get(0).passed());
    }

    @Test
    void getAttemptHistory_InvalidPageSize_ThrowsValidationError() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(quizQuestionRepository.findByAssignmentId(assignmentId)).thenReturn(List.of(question1, question2));

        ApiException exception = assertThrows(ApiException.class,
                () -> quizAttemptService.getAttemptHistory(assignmentId, userId, 0, 0));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
    }
}