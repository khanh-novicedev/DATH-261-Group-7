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

    // Batch count for API-21: one row per course -> [courseId, lessonCount]
    @Query("select l.course.id, count(l) from Lesson l where l.course.id in :courseIds group by l.course.id")
    List<Object[]> countByCourseIds(@Param("courseIds") Collection<UUID> courseIds);
    List<Lesson> findByCourseIdOrderBySequenceNumberAsc(UUID courseId);
}