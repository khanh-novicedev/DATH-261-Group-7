package com.class2life.dto.assessment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record QuizAttemptResponse(
        UUID id,
        UUID assignmentId,
        BigDecimal totalScore,
        // Sum of the points of all questions, computed at read time (not stored)
        Integer maxScore,
        // null when the assignment has no pass score
        Boolean passed,
        LocalDateTime attemptedAt
) {
}