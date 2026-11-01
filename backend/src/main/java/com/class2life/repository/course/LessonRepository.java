package com.class2life.repository.course;

import com.class2life.entity.course.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    int countByCourseId(UUID courseId);
    List<Lesson> findByCourseIdOrderBySequenceNumberAsc(UUID courseId);
}