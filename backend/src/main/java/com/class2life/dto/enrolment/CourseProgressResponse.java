package com.class2life.dto.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import java.util.List;
import java.util.UUID;

public record CourseProgressResponse(UUID courseId, UUID userId, String courseTitle,
                                     CompletionStatus completionStatus, long completedLessons, long totalLessons,
                                     int progressPercent, UUID lastPositionLessonId,
                                     List<LessonProgressResponse> lessons) {}
