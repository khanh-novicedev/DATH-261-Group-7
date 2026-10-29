package com.class2life.controller.enrolment;

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



}
