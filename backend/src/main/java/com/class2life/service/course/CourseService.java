package com.class2life.service.course;

import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.dto.course.CreateLessonRequest;
import com.class2life.entity.Course;
import com.class2life.entity.CourseStatus;
import com.class2life.entity.Lesson;
import com.class2life.mapper.CourseMapper;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final CourseMapper courseMapper;

    // Tiêm các dependency thông qua Constructor
    public CourseService(CourseRepository courseRepository, LessonRepository lessonRepository, CourseMapper courseMapper) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.courseMapper = courseMapper;
    }

    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request) {
        // 1. Khởi tạo và lưu Entity Course
        Course course = new Course();
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setCategory(request.category());
        course.setStatus(CourseStatus.DRAFT); // Mặc định khóa học mới tạo là DRAFT
        
        // Gán instructor khi Leader hoàn thành file User và tính năng đăng nhập
        // User instructor = userRepository.findById(instructorId).orElseThrow(...);
        // course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);

        // 2. Xử lý danh sách Lesson lồng bên trong (nếu có)
        List<Lesson> savedLessons = new ArrayList<>();
        if (request.lessons() != null && !request.lessons().isEmpty()) {
            for (CreateLessonRequest lessonReq : request.lessons()) {
                Lesson lesson = new Lesson();
                lesson.setCourse(savedCourse);
                lesson.setSequenceNumber(lessonReq.sequenceNumber());
                lesson.setTitle(lessonReq.title());
                lesson.setType(lessonReq.type());
                lesson.setContentUrl(lessonReq.contentUrl());
                savedLessons.add(lesson);
            }
            // Lưu toàn bộ bài học vào cơ sở dữ liệu
            savedLessons = lessonRepository.saveAll(savedLessons);
        }

        // 3. Map sang Response DTO và trả về
        return courseMapper.toCourseResponse(savedCourse, savedLessons);
    }
}