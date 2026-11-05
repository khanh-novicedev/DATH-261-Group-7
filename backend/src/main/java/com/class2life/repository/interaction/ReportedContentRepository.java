package com.class2life.repository.interaction;

import com.class2life.entity.interaction.ReportedContent;
import com.class2life.entity.interaction.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReportedContentRepository extends JpaRepository<ReportedContent, UUID> {
    List<ReportedContent> findByStatusOrderByCreatedAtAsc(ReportStatus status);
    List<ReportedContent> findAllByOrderByCreatedAtDesc();
}
