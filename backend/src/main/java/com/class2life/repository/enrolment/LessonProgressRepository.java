package com.class2life.repository.enrolment;

import com.class2life.entity.enrolment.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    List<LessonProgress> findByEnrolmentId(UUID enrolmentId);
    Optional<LessonProgress> findByEnrolmentIdAndLessonId(UUID enrolmentId, UUID lessonId);
    long countByEnrolmentIdAndIsCompletedTrue(UUID enrolmentId);

    // Batch count for API-21: one row per enrolment -> [enrolmentId, completedCount]
    @Query("select p.enrolment.id, count(p) from LessonProgress p " +
           "where p.enrolment.id in :enrolmentIds and p.isCompleted = true group by p.enrolment.id")
    List<Object[]> countCompletedByEnrolmentIds(@Param("enrolmentIds") Collection<UUID> enrolmentIds);
    void deleteByEnrolmentId(UUID enrolmentId);
}