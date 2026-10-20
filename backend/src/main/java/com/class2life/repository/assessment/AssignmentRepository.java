package com.class2life.repository.assessment;

import com.class2life.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    // All assignments attached to one lesson, oldest first
    List<Assignment> findByLessonIdOrderByCreatedAtAsc(UUID lessonId);
}