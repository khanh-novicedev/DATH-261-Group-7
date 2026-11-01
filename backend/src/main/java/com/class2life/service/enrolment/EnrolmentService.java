package com.class2life.service.enrolment;
import com.class2life.dto.enrolment.EnrolmentResponse;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.enrolment.Enrolment;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.user.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    public boolean isEnrolled(UUID userId, UUID courseId) {
        return enrolmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
    @Transactional
    public EnrolmentResponse enrol(UUID courseId) {
        User enrollingUser = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND, "User not found"));
        if (enrollingUser.getStatus() == UserStatus.SUSPENDED) {
            throw new ApiException(ErrorCode.ACCOUNT_SUSPENDED, "Account suspended");
        }
        if (enrollingUser.getRole() != UserRole.LEARNER) {
            throw new ApiException(ErrorCode.FORBIDDEN, "Only learners can enrol in a course");
        }

        Course enrollingCourse = courseRepository.findById(courseId).orElseThrow(() -> new ApiException(ErrorCode.COURSE_NOT_FOUND, "Course not found"));
        if (enrollingCourse.getStatus() != CourseStatus.PUBLISHED) {
            throw new ApiException(ErrorCode.COURSE_NOT_PUBLISHED, "Course not published");
        }

        if (enrolmentRepository.existsByUserIdAndCourseId(enrollingUser.getId(), courseId)) {
            throw new ApiException(ErrorCode.ALREADY_ENROLLED, "Already enrolled");
        }
        Enrolment enrolment = new Enrolment();
        enrolment.setCourse(enrollingCourse);
        enrolment.setUser(enrollingUser);
        try {
            return EnrolmentResponse.from(enrolmentRepository.saveAndFlush(enrolment));
        } catch (DataIntegrityViolationException ex) {
            throw new ApiException(ErrorCode.ALREADY_ENROLLED, "Already enrolled");
        }
    }
    @Transactional(readOnly = true)
    public List<Enrolment> myEnrolments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND, "User not found"));
        return enrolmentRepository.findByUserIdOrderByEnrolledAtDesc(user.getId());
    }
}