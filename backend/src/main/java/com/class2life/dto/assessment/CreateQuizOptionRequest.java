package com.class2life.dto.assessment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateQuizOptionRequest(
        @NotBlank(message = "Option content is required")
        String content,

        @NotNull(message = "isCorrect is required")
        Boolean isCorrect
) {
}