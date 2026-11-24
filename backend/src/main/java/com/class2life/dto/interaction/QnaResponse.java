package com.class2life.dto.interaction;

import com.class2life.entity.user.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record QnaResponse(UUID id, Author author, String content, LocalDateTime createdAt) {
    public record Author(UUID id, String fullName, UserRole role) {}
}