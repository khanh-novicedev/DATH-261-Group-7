package com.class2life.dto.assessment;

import com.class2life.entity.assessment.AssignmentType;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        UUID lessonId,
        String title,
        AssignmentType type,
        String instructions,
        Integer passScore,
        LocalDateTime deadline,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}