package com.class2life.repository.assessment;

import com.class2life.entity.assessment.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    // Attempt history of one learner for one quiz.
    // The sort order (for example attemptedAt descending) comes from the Pageable.
    Page<QuizAttempt> findByAssignmentIdAndUserId(UUID assignmentId, UUID userId, Pageable pageable);

    // All attempts of one learner for one quiz, newest first (API-32, no paging)
    List<QuizAttempt> findByAssignmentIdAndUserIdOrderByAttemptedAtDesc(UUID assignmentId, UUID userId);

    // API-26: quizzes of one lesson that this learner has attempted at least once (one query per lesson)
    @Query("SELECT DISTINCT a.assignment.id FROM QuizAttempt a " +
           "WHERE a.user.id = :userId AND a.assignment.lesson.id = :lessonId")
    List<UUID> findAttemptedAssignmentIds(@Param("userId") UUID userId, @Param("lessonId") UUID lessonId);
}