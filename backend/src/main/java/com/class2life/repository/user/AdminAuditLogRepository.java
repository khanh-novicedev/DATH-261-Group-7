package com.class2life.repository.user;

import com.class2life.entity.user.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, UUID> {}

