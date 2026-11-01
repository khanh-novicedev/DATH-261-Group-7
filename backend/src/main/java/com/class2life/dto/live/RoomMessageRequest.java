package com.class2life.dto.live;

import jakarta.validation.constraints.NotBlank;

public record RoomMessageRequest(
        @NotBlank
        String content
) {
}
