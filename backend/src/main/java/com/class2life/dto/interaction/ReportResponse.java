package com.class2life.dto.interaction;

import com.class2life.entity.interaction.ReportStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReportResponse(UUID id, UUID reporterId, String reportedEntityType,
        UUID reportedEntityId, String reason, ReportStatus status, UUID resolvedBy,
        LocalDateTime createdAt, LocalDateTime resolvedAt) {}
