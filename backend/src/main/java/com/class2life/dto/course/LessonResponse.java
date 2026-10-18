package com.class2life.dto.course;

import com.class2life.entity.LessonType;
import java.time.LocalDateTime;
import java.util.UUID;

public record LessonResponse(
        UUID id,
        Integer sequenceNumber,
        String title,
        LessonType type,
        String contentUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}