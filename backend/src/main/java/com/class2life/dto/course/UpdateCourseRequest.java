package com.class2life.dto.course;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record UpdateCourseRequest(
        @NotBlank(message = "Course title is required")
        String title,

        String description,
        
        String category,

        String prerequisites,

        @Valid 
        List<UpdateLessonRequest> lessons
) {
}