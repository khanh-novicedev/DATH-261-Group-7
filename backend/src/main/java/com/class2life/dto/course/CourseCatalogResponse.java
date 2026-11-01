package com.class2life.dto.course;

import com.class2life.entity.course.CourseStatus;
import java.util.UUID;

public record CourseCatalogResponse(
        UUID id,
        String title,
        String description,
        String category,
        CourseStatus status,
        InstructorSummary instructor,
        int lessonCount
) {
}
