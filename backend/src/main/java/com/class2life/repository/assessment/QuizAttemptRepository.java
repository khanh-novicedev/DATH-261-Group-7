package com.class2life.repository.assessment;

import com.class2life.entity.assessment.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    // Attempt history of one learner for one quiz.
    // The sort order (for example attemptedAt descending) comes from the Pageable.
    Page<QuizAttempt> findByAssignmentIdAndUserId(UUID assignmentId, UUID userId, Pageable pageable);
}