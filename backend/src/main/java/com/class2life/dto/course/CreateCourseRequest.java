package com.class2life.dto.course;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateCourseRequest(
        @NotBlank(message = "Course title is required")
        String title,

        String description,
        
        String category,

        // @Valid để Spring Boot kiểm tra luôn các bài học lồng bên trong
        @Valid 
        List<CreateLessonRequest> lessons
) {
}