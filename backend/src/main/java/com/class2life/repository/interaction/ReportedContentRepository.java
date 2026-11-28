package com.class2life.repository.interaction;

import com.class2life.entity.interaction.ReportedContent;
import com.class2life.entity.interaction.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReportedContentRepository extends JpaRepository<ReportedContent, UUID> {
    @EntityGraph(attributePaths = "reporter")
    Page<ReportedContent> findByStatusOrderByCreatedAtAsc(ReportStatus status, Pageable pageable);
    List<ReportedContent> findAllByOrderByCreatedAtDesc();
    // API-36: one open report per reporter per entity
    boolean existsByReporterIdAndReportedEntityTypeAndReportedEntityIdAndStatus(
            UUID reporterId, String reportedEntityType, UUID reportedEntityId, ReportStatus status);
    // API-38: every open report on the same entity is closed together
    List<ReportedContent> findByReportedEntityTypeAndReportedEntityIdAndStatus(
            String reportedEntityType, UUID reportedEntityId, ReportStatus status);
}
