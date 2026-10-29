package com.class2life.dto.enrolment;

import java.time.LocalDateTime;
import java.util.UUID;

public record LessonProgressResponse(UUID lessonId, String lessonTitle, Integer sequenceNumber,
        boolean completed, LocalDateTime completedAt) {}