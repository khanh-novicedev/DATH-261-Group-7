package com.class2life.dto.live;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateLiveSessionRequest(
        @NotNull
        UUID lessonId,
        @NotNull
        LocalDateTime scheduledTime
) {
}
