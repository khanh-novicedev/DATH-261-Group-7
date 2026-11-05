package com.class2life.repository.enrolment;

import com.class2life.entity.enrolment.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    List<LessonProgress> findByEnrolmentId(UUID enrolmentId);
    Optional<LessonProgress> findByEnrolmentIdAndLessonId(UUID enrolmentId, UUID lessonId);
    long countByEnrolmentIdAndIsCompletedTrue(UUID enrolmentId);
    void deleteByEnrolmentId(UUID enrolmentId);
}