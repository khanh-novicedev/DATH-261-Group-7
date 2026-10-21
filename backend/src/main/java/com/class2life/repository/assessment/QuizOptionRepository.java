package com.class2life.repository.assessment;

import com.class2life.entity.assessment.QuizOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizOptionRepository extends JpaRepository<QuizOption, UUID> {

    // All options of every question in one quiz, loaded in a single query
    // (path: option.question.assignment.id) to avoid one query per question.
    List<QuizOption> findByQuestionAssignmentId(UUID assignmentId);
}