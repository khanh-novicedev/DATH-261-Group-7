package com.class2life.dto.audit;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAuditLogFilter(
        String action,
        UUID actorId,
        LocalDateTime from,
        LocalDateTime to
) {
}
