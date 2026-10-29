package com.class2life.dto.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import java.util.List;
import java.util.UUID;

public record CourseProgressResponse(UUID courseId, String courseTitle, CompletionStatus status,
        long completedLessons, long totalLessons, double completionPercentage,
        List<LessonProgressResponse> lessons) {}
