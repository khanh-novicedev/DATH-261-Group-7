package com.class2life.controller.enrolment;

import com.class2life.common.ApiResponse;
import com.class2life.dto.enrolment.CourseMetricsResponse;
import com.class2life.dto.enrolment.CourseProgressResponse;
import com.class2life.dto.enrolment.EnrolmentResponse;
import com.class2life.dto.enrolment.UpdateLessonProgressRequest;
import com.class2life.service.enrolment.EnrolmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnrolmentController {
    private final EnrolmentService enrolmentService;

    // API-19
    @PostMapping("/courses/{courseId}/enrolment")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<EnrolmentResponse> enrol(@PathVariable UUID courseId) {
        return new ApiResponse<>(true, "Enrol Successfully", enrolmentService.enrol(courseId));
    }

    // API-20
    @DeleteMapping("/courses/{courseId}/enrolment")
    public ApiResponse<Void> unenrol(@PathVariable UUID courseId) {
        enrolmentService.unenrol(courseId);
        return new ApiResponse<>(true, "Enrolment removed", (Void) null);
    }

    // API-21 (pagination is a follow-up)
    @GetMapping("/enrolments")
    public ApiResponse<List<EnrolmentResponse>> enrolmentList() {
        return new ApiResponse<>(true, "Enrolments retrieved", enrolmentService.myEnrolments());
    }

    // API-22
    @PutMapping("/courses/{courseId}/progress/lessons/{lessonId}")
    public ApiResponse<CourseProgressResponse> updateProgress(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            @Valid @RequestBody UpdateLessonProgressRequest request) {
        return new ApiResponse<>(true, "Progress updated",
                enrolmentService.updateProgress(courseId, lessonId, request.isCompleted()));
    }

    // API-23
    @GetMapping("/courses/{courseId}/progress")
    public ApiResponse<CourseProgressResponse> getProgress(
            @PathVariable UUID courseId,
            @RequestParam(required = false) UUID userId) {
        return new ApiResponse<>(true, "Progress retrieved", enrolmentService.getProgress(courseId, userId));
    }

    // API-24 (pagination and the courseId filter are follow-ups)
    @GetMapping("/metrics/courses")
    public ApiResponse<List<CourseMetricsResponse>> courseMetrics() {
        return new ApiResponse<>(true, "Course metrics retrieved", enrolmentService.courseMetrics());
    }
}
