package com.class2life.dto.assessment;

import java.util.List;
import java.util.UUID;

public record QuizQuestionResponse(
        UUID id,
        String content,
        Integer points,
        List<QuizOptionResponse> options
) {
}