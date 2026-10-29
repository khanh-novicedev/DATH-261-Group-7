package com.class2life.dto.auth;

import com.class2life.entity.user.UserRole;

import java.util.UUID;

public record AuthUserResponse(
    UUID id,
    String fullName,
    String email,
    UserRole role
) {
}
