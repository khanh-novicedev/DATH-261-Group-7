package com.class2life.service.enrolment;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    public boolean isEnrolled(UUID userId, UUID courseId) {
        return enrolmentService.isEnrolled(userId, courseId);
    }
}