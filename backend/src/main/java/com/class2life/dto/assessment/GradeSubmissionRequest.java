package com.class2life.dto.assessment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record GradeSubmissionRequest(
        @NotNull(message = "Score is required")
        @DecimalMin(value = "0", message = "Score cannot be negative")
        BigDecimal score,

        String feedback
) {
}