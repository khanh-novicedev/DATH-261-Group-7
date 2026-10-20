package com.class2life.controller.course;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.course.CourseCatalogResponse;
import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.service.course.CourseService;

import jakarta.validation.Valid;

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
    // API: GET /api/courses
    // Nhận các tham số tìm kiếm và phân trang từ URL (Query Parameters)
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CourseCatalogResponse>>> getCourseCatalog(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var response = courseService.getCourseCatalog(keyword, category, page, size);
        var apiResponse = new ApiResponse<>(true, "Catalog retrieved successfully", response);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseDetails(@PathVariable UUID courseId) {
        CourseResponse response = courseService.getCourseDetails(courseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Course details retrieved", response));
    }

    // API: PUT /api/courses/{courseId}
    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable UUID courseId,
            @Valid @RequestBody com.class2life.dto.course.UpdateCourseRequest request
    ) {
        CourseResponse response = courseService.updateCourse(courseId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Course updated successfully", response));
    }

    // API: PATCH /api/courses/{courseId}/status
    @PatchMapping("/{courseId}/status")
    public ResponseEntity<ApiResponse<CourseResponse>> changeCourseStatus(
            @PathVariable java.util.UUID courseId,
            @Valid @RequestBody com.class2life.dto.course.ChangeCourseStatusRequest request
    ) {
        CourseResponse response = courseService.changeCourseStatus(courseId, request.status());
        return ResponseEntity.ok(new ApiResponse<>(true, "Course status changed successfully", response));
    }

    // API: DELETE /api/courses/{courseId}
    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable java.util.UUID courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Course deleted successfully", null));
    }
}