package com.class2life.dto.course;

import com.class2life.entity.LessonType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateLessonRequest(
        UUID id, 

        @NotNull(message = "Sequence number is required")
        Integer sequenceNumber,

        @NotBlank(message = "Lesson title is required")
        String title,

        @NotNull(message = "Lesson type is required")
        LessonType type,

        String contentUrl
) {
}