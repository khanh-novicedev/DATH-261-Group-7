package com.class2life.repository.interaction;

import com.class2life.entity.interaction.LessonQna;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonQnaRepository extends JpaRepository<LessonQna, UUID> {
    List<LessonQna> findByLessonIdOrderByCreatedAtAsc(UUID lessonId);
    List<LessonQna> findByParentIdOrderByCreatedAtAsc(UUID parentId);
    Optional<LessonQna> findByIdAndParentIsNull(UUID id);
}
