package com.class2life.dto.course;

import java.util.UUID;

public record InstructorSummary(
        UUID id,
        String fullName
) {
}
