package com.class2life.dto.assessment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionResponse(
        UUID id,
        UUID assignmentId,
        UUID learnerId,
        String learnerName,
        String fileUrl,
        BigDecimal score,
        String feedback,
        UUID gradedBy,
        LocalDateTime submittedAt,
        LocalDateTime gradedAt
) {
}