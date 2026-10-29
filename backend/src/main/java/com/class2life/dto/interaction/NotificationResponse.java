package com.class2life.dto.interaction;

import com.class2life.entity.interaction.NotificationType;
import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(UUID id, NotificationType type, String content,
        boolean isRead, LocalDateTime createdAt) {}
