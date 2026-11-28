package com.class2life.dto.assessment;

import com.class2life.entity.assessment.AssignmentType;
import java.time.LocalDateTime;
import java.util.UUID;

// API-26 list item. submitted is the caller's own status: true/false for a learner, null for instructor/admin.
public record LessonAssignmentResponse(
        UUID id,
        String title,
        AssignmentType type,
        LocalDateTime deadline,
        Integer passScore,
        Boolean submitted
) {
}
