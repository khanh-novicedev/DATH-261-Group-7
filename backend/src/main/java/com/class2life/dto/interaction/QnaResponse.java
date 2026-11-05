package com.class2life.dto.interaction;

import java.time.LocalDateTime;
import java.util.UUID;

public record QnaResponse(UUID id, UUID lessonId, UUID authorId, String authorName,
        UUID parentId, String content, LocalDateTime createdAt) {}
