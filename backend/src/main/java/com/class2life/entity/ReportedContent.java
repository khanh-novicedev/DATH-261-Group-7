package com.class2life.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity 
@Table(name = "reported_contents")
public class ReportedContent {
      
      @Id 
      @GeneratedValue(strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "reporter_id", nullable = false)
      private User reporter;

      */

      @Column(name = "reported_entity_type", nullable = false)
      private String reportedEntityType;

      @Column(name = "reported_entity_id", nullable = false)
      private UUID reportedEntityId;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "resolved_by")
      private User resolvedBy;
      
      */

      @Column(name = "reason", nullable = false, columnDefinition = "text")
      private String reason;

      @Enumerated(EnumType.STRING)
      @JdbcTypeCode(SqlTypes.NAMED_ENUM)
      @Column(name = "status", nullable = false)
      private ReportStatus status = ReportStatus.PENDING;

      @CreationTimestamp 
      @Column(name = "created_at", nullable = false)
      private LocalDateTime createdAt;

      @Column(name = "resolved_at", nullable = false)
      private LocalDateTime resolvedAt;


      //constructor
      public ReportedContent() {

      }

      //---method----
      public UUID getId() {
            return id;
      }

      public void setId(UUID id) {
            this.id = id;
      }

      public String getReportedEntityType() {
            return reportedEntityType;
      }

      public void setReportedEntityType(String reportedEntityType) {
            this.reportedEntityType = reportedEntityType;
      }

      public UUID getReportedEntityId() {
            return reportedEntityId;
      }

      public void setReportedEntityId(UUID reportedEntityId) {
            this.reportedEntityId = reportedEntityId;
      }

      public String getReason() {
            return reason;
      }

      public void setReason(String reason) {
            this.reason = reason;
      }

      public ReportStatus getStatus() {
            return status;
      }

      public void setStatus(ReportStatus status) {
            this.status = status;
      }

      public LocalDateTime getCreatedAt() {
            return createdAt;
      }

      public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
      }

      public LocalDateTime getResolvedAt() {
            return resolvedAt;
      }

      public void setResolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
      }

      /*
      
      public User getReporter() {
            return reporter;
      }
      
      public void setReporter(User reporter) {
            this.reporter = reporter;
      }

      public User getResolvedBy() {
            return resolvedBy;
      }

      public void setResolvedBy(User resolvedBy) {
            this.resolvedBy = resolvedBy;
      }

      */

}
