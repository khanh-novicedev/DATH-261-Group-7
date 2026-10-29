package com.class2life.dto.assessment;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record QuizAnswerRequest(
        @NotNull(message = "Question id is required")
        UUID questionId,

        // An empty list means the learner skipped the question
        @NotNull(message = "Selected option ids are required")
        List<UUID> selectedOptionIds
) {
}