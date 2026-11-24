package com.class2life.repository.interaction;

import com.class2life.entity.interaction.LessonQna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonQnaRepository extends JpaRepository<LessonQna, UUID> {
    @EntityGraph(attributePaths = "author")
    Page<LessonQna> findByLessonIdAndParentIsNullOrderByCreatedAtDesc(UUID lessonId, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    List<LessonQna> findByParentIdInOrderByCreatedAtAsc(Collection<UUID> parentIds);
    Optional<LessonQna> findByIdAndParentIsNull(UUID id);
    List<LessonQna> findByParentIdOrderByCreatedAtAsc(UUID parentId);
}
