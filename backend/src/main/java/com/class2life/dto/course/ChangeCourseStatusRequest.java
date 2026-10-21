package com.class2life.dto.course;

import com.class2life.entity.course.CourseStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeCourseStatusRequest(
        @NotNull(message = "Status is required")
        CourseStatus status
) {
}