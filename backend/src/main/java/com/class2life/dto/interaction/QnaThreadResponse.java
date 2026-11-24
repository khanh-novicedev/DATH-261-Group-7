package com.class2life.dto.interaction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record QnaThreadResponse(UUID id, QnaResponse.Author author, String content,
                                LocalDateTime createdAt, List<QnaResponse> replies) {}
