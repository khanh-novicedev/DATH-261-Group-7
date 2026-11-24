package com.class2life.repository.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import com.class2life.entity.enrolment.Enrolment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrolmentRepository extends JpaRepository<Enrolment, UUID> {
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    Optional<Enrolment> findByUserIdAndCourseId(UUID userId, UUID courseId);
    // API-21: one page of a learner's enrolments, newest first; course fetched in the same query
    @EntityGraph(attributePaths = "course")
    Page<Enrolment> findByUserIdOrderByEnrolledAtDesc(UUID userId, Pageable pageable);

    @EntityGraph(attributePaths = "course")
    Page<Enrolment> findByUserIdAndCompletionStatusOrderByEnrolledAtDesc(UUID userId, CompletionStatus status, Pageable pageable);
    List<Enrolment> findByCourseId(UUID courseId);

    // API-24 batch counts: one row per course -> [courseId, count]
    @Query("select e.course.id, count(e) from Enrolment e where e.course.id in :courseIds group by e.course.id")
    List<Object[]> countByCourseIds(@Param("courseIds") Collection<UUID> courseIds);

    @Query("select e.course.id, count(e) from Enrolment e " +
           "where e.course.id in :courseIds and e.completionStatus = :status group by e.course.id")
    List<Object[]> countByCourseIdsAndStatus(@Param("courseIds") Collection<UUID> courseIds,
                                             @Param("status") CompletionStatus status);
    long countByCourseId(UUID courseId);
}
