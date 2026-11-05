package com.class2life.dto.interaction;

import com.class2life.entity.interaction.ReportStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReportResponse(UUID id, Reporter reporter, String entityType, UUID entityId,
        String reason, ReportStatus status, LocalDateTime createdAt,
        UUID resolvedBy, LocalDateTime resolvedAt) {
    public record Reporter(UUID id, String fullName) {}
}
