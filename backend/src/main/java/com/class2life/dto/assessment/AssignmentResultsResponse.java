package com.class2life.dto.assessment;

import com.class2life.entity.assessment.AssignmentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AssignmentResultsResponse(
    UUID assignmentId,
    AssignmentType type,
    Integer passScore,
    List<ResultItem> items
) {

    // One quiz attempt or one file submission; fields that do not apply to the assignment type are null
    public record ResultItem(
        UUID id,
        BigDecimal score,
        // Quiz only
        Integer maxScore,
        LocalDateTime submittedAt,
        // File submission only
        String fileUrl,
        String feedback,
        LocalDateTime gradedAt
    ) {
    }
}
