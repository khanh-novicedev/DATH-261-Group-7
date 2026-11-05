package com.class2life.repository.user;

import com.class2life.entity.user.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, UUID> {
    Optional<PasswordReset> findByTokenHashAndUsedAtIsNull(String tokenHash);
}