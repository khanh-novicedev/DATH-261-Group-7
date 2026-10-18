package com.class2life.repository.course;

import com.class2life.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
}