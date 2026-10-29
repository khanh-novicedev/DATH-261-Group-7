package com.class2life.dto.assessment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateQuizQuestionRequest(
        @NotBlank(message = "Question content is required")
        String content,

        // Optional: the schema default (1 point) is used when this is null
        @Min(value = 1, message = "Points must be at least 1")
        Integer points,

        @NotEmpty(message = "A question needs at least one option")
        @Valid
        List<CreateQuizOptionRequest> options
) {
}