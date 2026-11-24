package com.class2life.dto.user;

import com.class2life.entity.user.UserStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateUserStatusResponse(
        UUID id,
        UserStatus status
) {
}
