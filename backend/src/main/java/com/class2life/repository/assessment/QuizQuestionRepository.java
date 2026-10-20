package com.class2life.repository.assessment;

import com.class2life.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {

    // All questions of one quiz assignment.
    // The schema has no position column, so the order is not guaranteed.
    List<QuizQuestion> findByAssignmentId(UUID assignmentId);
}