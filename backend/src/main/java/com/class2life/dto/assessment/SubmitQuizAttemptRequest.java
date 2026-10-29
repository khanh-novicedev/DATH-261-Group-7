package com.class2life.dto.assessment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record SubmitQuizAttemptRequest(
        @NotEmpty(message = "At least one answer is required")
        @Valid
        List<QuizAnswerRequest> answers
) {
}