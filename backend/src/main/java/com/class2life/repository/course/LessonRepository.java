package com.class2life.repository.course;

import com.class2life.entity.course.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.UUID;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    int countByCourseId(UUID courseId);
    List<Lesson> findByCourseIdOrderBySequenceNumberAsc(UUID courseId);

    @Query("SELECT l.course.id AS courseId, COUNT(l) AS lessonCount FROM Lesson l WHERE l.course.id IN :courseIds GROUP BY l.course.id")
    List<LessonCount> countByCourseIds(@Param("courseIds") Collection<UUID> courseIds);

    interface LessonCount {
        UUID getCourseId();
        Long getLessonCount();
    }
}
