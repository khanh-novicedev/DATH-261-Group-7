package com.class2life.mapper;

import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.LessonResponse;
import com.class2life.entity.Course;
import com.class2life.entity.Lesson;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    // Chuyển đổi từ Lesson Entity sang LessonResponse DTO
    public LessonResponse toLessonResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getSequenceNumber(),
                lesson.getTitle(),
                lesson.getType(),
                lesson.getContentUrl(),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt()
        );
    }

    // Chuyển đổi từ Course Entity sang CourseResponse DTO (bao gồm cả danh sách bài học)
    public CourseResponse toCourseResponse(Course course, List<Lesson> lessons) {
        List<LessonResponse> lessonResponses = lessons.stream()
                .map(this::toLessonResponse)
                .collect(Collectors.toList());

        return new CourseResponse(
                course.getId(),
                null, // course.getInstructor().getId() khi Leader đã push User.java
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getStatus(),
                lessonResponses,
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }
}