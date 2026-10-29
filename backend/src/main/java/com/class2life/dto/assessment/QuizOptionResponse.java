package com.class2life.dto.assessment;

import java.util.UUID;

// Learner-facing view of an option. It must never carry the is_correct flag.
public record QuizOptionResponse(
        UUID id,
        String content
) {
}