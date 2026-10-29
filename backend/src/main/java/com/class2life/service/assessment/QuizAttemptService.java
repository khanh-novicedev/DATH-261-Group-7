package com.class2life.service.assessment;

import com.class2life.common.PageResponse;
import com.class2life.dto.assessment.QuizAnswerRequest;
import com.class2life.dto.assessment.QuizAttemptResponse;
import com.class2life.dto.assessment.SubmitQuizAttemptRequest;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizAttempt;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.QuizMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizAttemptRepository;
import com.class2life.repository.assessment.QuizOptionRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class QuizAttemptService {

    private final AssignmentRepository assignmentRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizOptionRepository quizOptionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserReferenceProvider userReferenceProvider;
    private final QuizMapper quizMapper;

    public QuizAttemptService(AssignmentRepository assignmentRepository,
                              QuizQuestionRepository quizQuestionRepository,
                              QuizOptionRepository quizOptionRepository,
                              QuizAttemptRepository quizAttemptRepository,
                              UserReferenceProvider userReferenceProvider,
                              QuizMapper quizMapper) {
        this.assignmentRepository = assignmentRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizOptionRepository = quizOptionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.userReferenceProvider = userReferenceProvider;
        this.quizMapper = quizMapper;
    }

    // Grades the answers on the server and stores one new quiz_attempts row per attempt (attempts are unlimited)
    @Transactional
    public QuizAttemptResponse submitAttempt(UUID assignmentId, UUID userId, SubmitQuizAttemptRequest request) {
        Assignment assignment = findQuizOrThrow(assignmentId);

        // TODO: the learner must be enrolled in the course of this lesson:
        // call EnrolmentService.isEnrolled(userId, courseId) once Khanh Phat implements it

        if (assignment.getDeadline() != null && LocalDateTime.now().isAfter(assignment.getDeadline())) {
            throw new ApiException(ErrorCode.DEADLINE_PASSED, "The deadline of this quiz has passed");
        }

        List<QuizQuestion> questions = quizQuestionRepository.findByAssignmentId(assignmentId);
        List<QuizOption> options = quizOptionRepository.findByQuestionAssignmentId(assignmentId);

        // Every option id of each question, and the ids that are marked correct
        Map<UUID, Set<UUID>> optionIdsByQuestion = new HashMap<>();
        Map<UUID, Set<UUID>> correctIdsByQuestion = new HashMap<>();
        for (QuizQuestion question : questions) {
            optionIdsByQuestion.put(question.getId(), new HashSet<>());
            correctIdsByQuestion.put(question.getId(), new HashSet<>());
        }
        for (QuizOption option : options) {
            UUID questionId = option.getQuestion().getId();
            optionIdsByQuestion.get(questionId).add(option.getId());
            if (Boolean.TRUE.equals(option.getIsCorrect())) {
                correctIdsByQuestion.get(questionId).add(option.getId());
            }
        }

        Map<UUID, Set<UUID>> selectedByQuestion = readAnswers(request, optionIdsByQuestion);

        // A question earns its full points only when the selected options are exactly the correct options
        int totalScore = 0;
        for (QuizQuestion question : questions) {
            Set<UUID> correctIds = correctIdsByQuestion.get(question.getId());
            Set<UUID> selectedIds = selectedByQuestion.getOrDefault(question.getId(), Set.of());
            if (!correctIds.isEmpty() && correctIds.equals(selectedIds)) {
                totalScore += question.getPoints();
            }
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setAssignment(assignment);
        attempt.setUser(userReferenceProvider.getReference(userId));
        attempt.setTotalScore(BigDecimal.valueOf(totalScore));
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        return quizMapper.toQuizAttemptResponse(savedAttempt, maxScoreOf(questions), assignment.getPassScore());
    }

    @Transactional(readOnly = true)
    public PageResponse<QuizAttemptResponse> getAttemptHistory(UUID assignmentId, UUID userId, int page, int size) {
        Assignment assignment = findQuizOrThrow(assignmentId);
        int maxScore = maxScoreOf(quizQuestionRepository.findByAssignmentId(assignmentId));

        Page<QuizAttempt> attempts = quizAttemptRepository.findByAssignmentIdAndUserId(
                assignmentId, userId, AssessmentPaging.of(page, size, Sort.by(Sort.Direction.DESC, "attemptedAt")));

        return PageResponse.of(attempts.map(
                attempt -> quizMapper.toQuizAttemptResponse(attempt, maxScore, assignment.getPassScore())));
    }

    private Assignment findQuizOrThrow(UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found"));
        if (assignment.getType() != AssignmentType.QUIZ) {
            throw new ApiException(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, "This assignment is not a quiz");
        }
        return assignment;
    }

    // Validates that every answer points at a question of this quiz and at options of that question
    private Map<UUID, Set<UUID>> readAnswers(SubmitQuizAttemptRequest request, Map<UUID, Set<UUID>> optionIdsByQuestion) {
        Map<UUID, Set<UUID>> selectedByQuestion = new HashMap<>();
        for (QuizAnswerRequest answer : request.answers()) {
            Set<UUID> validOptionIds = optionIdsByQuestion.get(answer.questionId());
            if (validOptionIds == null) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR, "Question does not belong to this quiz");
            }
            if (selectedByQuestion.containsKey(answer.questionId())) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR, "A question can only be answered once");
            }
            Set<UUID> selectedIds = answer.selectedOptionIds() == null
                    ? new HashSet<>() : new HashSet<>(answer.selectedOptionIds());
            if (!validOptionIds.containsAll(selectedIds)) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR, "An option does not belong to its question");
            }
            selectedByQuestion.put(answer.questionId(), selectedIds);
        }
        return selectedByQuestion;
    }

    private int maxScoreOf(List<QuizQuestion> questions) {
        return questions.stream().mapToInt(QuizQuestion::getPoints).sum();
    }
}