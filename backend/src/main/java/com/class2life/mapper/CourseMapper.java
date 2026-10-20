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

    public LessonResponse toLessonResponse(Lesson lesson, boolean isFullView) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getSequenceNumber(),
                lesson.getTitle(),
                lesson.getType(),
                isFullView ? lesson.getContentUrl() : null, // Ẩn URL nếu không có quyền
                lesson.getCreatedAt(),
                lesson.getUpdatedAt()
        );
    }

    public CourseResponse toCourseResponse(Course course, List<Lesson> lessons, boolean isFullView) {
        List<LessonResponse> lessonResponses = lessons.stream()
                .map(l -> toLessonResponse(l, isFullView))
                .collect(Collectors.toList());

        return new CourseResponse(
                course.getId(),
                null, // course.getInstructor().getId()
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                null, // course.getPrerequisites(),
                course.getStatus(),
                lessonResponses,
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }

    // Giữ lại hàm cũ cho createCourse (Mặc định Full View)
    public CourseResponse toCourseResponse(Course course, List<Lesson> lessons) {
        return toCourseResponse(course, lessons, true);
    }
}