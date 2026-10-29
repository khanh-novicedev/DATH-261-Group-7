package com.class2life.dto.assessment;

import com.class2life.entity.assessment.AssignmentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record CreateAssignmentRequest(
        @NotBlank(message = "Assignment title is required")
        String title,

        @NotNull(message = "Assignment type is required")
        AssignmentType type,

        String instructions,

        // Quiz only: minimum total score required to pass
        @Min(value = 0, message = "Pass score cannot be negative")
        Integer passScore,

        // Optional: null means there is no deadline
        LocalDateTime deadline,

        // Quiz only: required for QUIZ, must be empty for FILE_SUBMISSION
        @Valid
        List<CreateQuizQuestionRequest> questions
) {
}