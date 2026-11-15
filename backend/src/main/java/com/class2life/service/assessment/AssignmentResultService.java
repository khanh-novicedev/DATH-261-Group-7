package com.class2life.service.assessment;

import com.class2life.dto.assessment.AssignmentResultsResponse;
import com.class2life.dto.assessment.AssignmentResultsResponse.ResultItem;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizQuestion;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssignmentResultService {

    private final AssignmentRepository assignmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final SubmissionRepository submissionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final EnrolmentService enrolmentService;
    private final UserRepository userRepository;
    private final ResultMapper resultMapper;

    public AssignmentResultService(AssignmentRepository assignmentRepository,
                                   QuizAttemptRepository quizAttemptRepository,
                                   SubmissionRepository submissionRepository,
                                   QuizQuestionRepository quizQuestionRepository,
                                   EnrolmentService enrolmentService,
                                   UserRepository userRepository,
                                   ResultMapper resultMapper) {
        this.assignmentRepository = assignmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.submissionRepository = submissionRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.enrolmentService = enrolmentService;
        this.userRepository = userRepository;
        this.resultMapper = resultMapper;
    }

    // API-32: the logged-in learner's own attempts (quiz) or submissions (file), newest first
    @Transactional(readOnly = true)
    public AssignmentResultsResponse getMyResults(UUID assignmentId) {
        User user = currentUser();

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found"));

        UUID courseId = assignment.getLesson().getCourse().getId();
        if (!enrolmentService.isEnrolled(user.getId(), courseId)) {
            throw new ApiException(ErrorCode.NOT_ENROLLED, "You are not enrolled in the course of this assignment");
        }

        List<ResultItem> items;
        if (assignment.getType() == AssignmentType.QUIZ) {
            int maxScore = quizQuestionRepository.findByAssignmentId(assignmentId).stream()
                    .mapToInt(QuizQuestion::getPoints).sum();
            items = quizAttemptRepository
                    .findByAssignmentIdAndUserIdOrderByAttemptedAtDesc(assignmentId, user.getId()).stream()
                    .map(attempt -> resultMapper.toResultItem(attempt, maxScore))
                    .toList();
        } else {
            items = submissionRepository
                    .findByAssignmentIdAndUserIdOrderBySubmittedAtDesc(assignmentId, user.getId()).stream()
                    .map(resultMapper::toResultItem)
                    .toList();
        }

        return new AssignmentResultsResponse(assignment.getId(), assignment.getType(), assignment.getPassScore(), items);
    }

    // Same pattern as NotificationService: the token's name is the email of the logged-in user
    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}
