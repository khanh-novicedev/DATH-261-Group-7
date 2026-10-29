package com.class2life.repository.enrolment;

import com.class2life.entity.enrolment.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrolmentRepository extends JpaRepository<Enrolment, UUID> {
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    Optional<Enrolment> findByUserIdAndCourseId(UUID userId, UUID courseId);
    List<Enrolment> findByUserIdOrderByEnrolledAtDesc(UUID userId);
    List<Enrolment> findByCourseId(UUID courseId);
    long countByCourseId(UUID courseId);
}
