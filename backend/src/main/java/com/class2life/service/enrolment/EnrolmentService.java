package com.class2life.service.enrolment;
import org.springframework.stereotype.Service;
import java.util.UUID;


@Service
public class EnrolmentService {
    public boolean isEnrolled(UUID userId, UUID courseId) {
        throw new UnsupportedOperationException("TODO: implement with EnrolmentRepository");
    }
}