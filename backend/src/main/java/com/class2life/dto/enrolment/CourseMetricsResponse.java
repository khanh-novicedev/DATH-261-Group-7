package com.class2life.dto.enrolment;

import java.util.UUID;

public record CourseMetricsResponse(UUID courseId, String courseTitle, long enrolmentCount,
        long completedEnrolments, double completionRate) {}
