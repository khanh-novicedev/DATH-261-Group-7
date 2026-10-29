package com.class2life.controller.assessment;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.assessment.QuizAttemptResponse;
import com.class2life.dto.assessment.SubmitQuizAttemptRequest;
import com.class2life.service.assessment.QuizAttemptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/assignments/{assignmentId}/attempts")
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    public QuizAttemptController(QuizAttemptService quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }

    // API: POST /api/assignments/{assignmentId}/attempts
    // Role: LEARNER
    // TODO: remove the userId request parameter and read the logged-in user from the SecurityContext
    // once the Leader finishes SecurityConfig; add the role rule at the same time
    @PostMapping
    public ResponseEntity<ApiResponse<QuizAttemptResponse>> submitAttempt(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId,
            @Valid @RequestBody SubmitQuizAttemptRequest request
    ) {
        QuizAttemptResponse response = quizAttemptService.submitAttempt(assignmentId, userId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Quiz graded successfully", response), HttpStatus.CREATED);
    }

    // API: GET /api/assignments/{assignmentId}/attempts?page=0&size=10
    // Attempt history of the logged-in learner, newest first
    // TODO: same as above, the userId comes from the SecurityContext later
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<QuizAttemptResponse>>> getAttemptHistory(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<QuizAttemptResponse> response = quizAttemptService.getAttemptHistory(assignmentId, userId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Attempt history retrieved successfully", response));
    }
}