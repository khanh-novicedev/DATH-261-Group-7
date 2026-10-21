package com.class2life.repository.assessment;

import com.class2life.entity.assessment.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    // Submission history of one learner for one assignment.
    // The sort order (for example submittedAt descending) comes from the Pageable.
    Page<Submission> findByAssignmentIdAndUserId(UUID assignmentId, UUID userId, Pageable pageable);

    // Instructor view: only the most recent submission of each learner for one assignment.
    // If two submissions of the same learner have exactly the same submittedAt, both are returned.
    @Query(value = "SELECT s FROM Submission s " +
                   "WHERE s.assignment.id = :assignmentId " +
                   "AND s.submittedAt = (SELECT MAX(s2.submittedAt) FROM Submission s2 " +
                   "WHERE s2.assignment.id = :assignmentId AND s2.user.id = s.user.id)",
           countQuery = "SELECT COUNT(s) FROM Submission s " +
                        "WHERE s.assignment.id = :assignmentId " +
                        "AND s.submittedAt = (SELECT MAX(s2.submittedAt) FROM Submission s2 " +
                        "WHERE s2.assignment.id = :assignmentId AND s2.user.id = s.user.id)")
    Page<Submission> findLatestByAssignmentId(@Param("assignmentId") UUID assignmentId, Pageable pageable);
}