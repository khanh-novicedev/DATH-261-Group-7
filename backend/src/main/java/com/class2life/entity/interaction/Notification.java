package com.class2life.entity.interaction;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity 
@Table(name = "notifications")
public class Notification {
      
      @Id 
      @GeneratedValue(strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "user_id", nullable = false)
      private User user;

      */

      @Enumerated(EnumType.STRING)
      @JdbcTypeCode(SqlTypes.NAMED_ENUM)
      @Column(name = "type", nullable = false)
      private NotificationType type;

      @Column(name = "content", nullable = false, columnDefinition = "text")
      private String content;

      @Column(name = "is_read", nullable = false)
      private Boolean isRead = false;

      @CreationTimestamp
      @Column(name = "created_at", nullable = false, updatable = false)
      private LocalDateTime createdAt;


      
      //constructor
      public Notification() {
            
      }
      
      //---method---
      public UUID getId() {
            return id;
      }

      public void setId(UUID id) {
            this.id = id;
      }

      public NotificationType getType() {
            return type;
      }

      public void setType(NotificationType type) {
            this.type = type;
      }

      public String getContent() {
            return content;
      }

      public void setContent(String content) {
            this.content = content;
      }

      public Boolean getIsRead() {
            return isRead;
      }

      public void setIsRead(Boolean isRead) {
            this.isRead = isRead;
      }

      public LocalDateTime getCreatedAt() {
            return createdAt;
      }

      public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
      }

      /*
      
      public User getUser() {
            return user;
      }
      
      public void setUser(User user) {
            this.user = user;
      }

      */

}
