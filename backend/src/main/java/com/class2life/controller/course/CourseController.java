package com.class2life.controller.course;

import com.class2life.common.ApiResponse;
import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.service.course.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses") // Bắt buộc plural và lowercase theo rule
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // API: POST /api/courses
    // Role: Instructor (sẽ gắn @PreAuthorize sau khi Leader cấu hình xong SecurityConfig)
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        // 1. Controller cực mỏng: Chỉ gọi Service
        CourseResponse response = courseService.createCourse(request);
        
        // 2. Bọc kết quả vào ApiResponse đúng chuẩn của team
        ApiResponse<CourseResponse> apiResponse = new ApiResponse<>(
                true, 
                "Course created successfully", 
                response
        );
        
        // 3. Trả về HTTP Status 201 (Created)
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }
}