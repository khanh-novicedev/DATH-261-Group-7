package com.class2life.dto.enrolment;
import java.util.UUID;

public record CourseMetricsResponse(UUID courseId, String title, long enrolledCount,
                                    long completedCount, double completionRate) {}
