package com.class2life.dto.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record EnrolmentResponse(UUID id, UUID courseId, String courseTitle,
        CompletionStatus completionStatus, UUID lastPositionLessonId, LocalDateTime enrolledAt,
        long completedLessons, long totalLessons) {}
