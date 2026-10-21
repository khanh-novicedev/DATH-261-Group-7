package com.class2life.dto.course;

import com.class2life.entity.course.CourseStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CourseResponse(
        UUID id,
        UUID instructorId,
        String title,
        String description,
        String category,
//        String prerequisites,
        CourseStatus status,
        List<LessonResponse> lessons,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}