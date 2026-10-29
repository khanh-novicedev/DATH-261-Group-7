package com.class2life.controller.enrolment;

import com.class2life.common.ApiResponse;
import com.class2life.dto.enrolment.*;
import com.class2life.service.enrolment.EnrolmentService;
/*
import jakarta.validation.Valid;
*/
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class EnrolmentController {
    private final EnrolmentService enrolmentService;

    @PostMapping("/api/courses/{courseId}/enrolment")
    public ResponseEntity<ApiResponse<EnrolmentResponse>> enrol(@PathVariable UUID courseId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Enrolled successfully", enrolmentService.enrol(courseId)));
    }

    @DeleteMapping("/api/courses/{courseId}/enrolment")
    public ResponseEntity<ApiResponse<Void>> unenrol(@PathVariable UUID courseId) {
        enrolmentService.unenrol(courseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Enrolment removed", (Void) null));
    }

    @GetMapping("/api/enrolments")
    public ResponseEntity<ApiResponse<List<EnrolmentResponse>>> myEnrolments() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Enrolments retrieved", enrolmentService.myEnrolments()));
    }

    @PutMapping("/api/courses/{courseId}/progress/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> updateProgress(
            @PathVariable UUID courseId, @PathVariable UUID lessonId,
            @RequestParam(defaultValue = "true") boolean completed) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Progress updated",
                enrolmentService.updateProgress(courseId, lessonId, completed)));
    }

    @GetMapping("/api/courses/{courseId}/progress")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getProgress(
            @PathVariable UUID courseId, @RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Progress retrieved",
                enrolmentService.getProgress(courseId, userId)));
    }

    @GetMapping("/api/metrics/courses")
    public ResponseEntity<ApiResponse<List<CourseMetricsResponse>>> courseMetrics() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Course metrics retrieved", enrolmentService.courseMetrics()));
    }
}

/*package com.class2life.controller.enrolment;

import com.class2life.service.course.CourseService;
import com.class2life.service.enrolment.EnrolmentService;
import com.class2life.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class EnrolmentController {
    private final UserService userService;
    private final CourseService courseService;
    private final EnrolmentService enrolmentService;



}*/
