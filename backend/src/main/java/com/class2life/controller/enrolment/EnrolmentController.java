package com.class2life.controller.enrolment;

import com.class2life.common.ApiResponse;
import com.class2life.dto.enrolment.EnrolmentResponse;
import com.class2life.entity.enrolment.Enrolment;
import com.class2life.service.course.CourseService;
import com.class2life.service.enrolment.EnrolmentService;
import com.class2life.service.user.UserService;
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

    @PostMapping("/courses/{courseId}/enrolment")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<EnrolmentResponse> enrol(@PathVariable UUID courseId) {
        return new ApiResponse<EnrolmentResponse>(true, "Enrol Successfully", EnrolmentResponse.from(enrolmentService.enrol(courseId)));
    }

    @GetMapping("/enrolments")
    public ApiResponse<List<EnrolmentResponse>> enrolmentList(){
        List<EnrolmentResponse> items = enrolmentService.myEnrolments().stream().map(EnrolmentResponse::from).toList();
        return new ApiResponse<>(true, "Enrolments retrieved", items);
    }

}
