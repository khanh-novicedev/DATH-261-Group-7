package com.class2life.dto.audit;

import com.class2life.entity.user.AdminAuditLog;
import com.class2life.entity.user.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAuditLogResponse(
        UUID id, Actor actor, String action, String entityType, UUID entityId, LocalDateTime createdAt
) {
    public record Actor(UUID id, String fullName, UserRole role) {}
    public static AdminAuditLogResponse toAdminAuditLogResponse(AdminAuditLog adminAuditLog) {
        Actor actor = new Actor(adminAuditLog.getActor().getId(), adminAuditLog.getActor().getFullName(), adminAuditLog.getActor().getRole());
        return new AdminAuditLogResponse(adminAuditLog.getId(), actor, adminAuditLog.getAction(), adminAuditLog.getEntityType(), adminAuditLog.getEntityId(), adminAuditLog.getCreatedAt());
    }
}
