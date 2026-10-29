package com.class2life.entity.user;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity 
@Table(name = "password_resets")
public class PasswordReset {

      @Id 
      @GeneratedValue(strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "user_id", nullable = false)
      private User user;

      @Column(name = "token_hash", nullable = false)
      private String tokenHash;

      @Column(name = "expire_at", nullable = false)
      private LocalDateTime expireAt;

      @Column(name = "used_at")
      private LocalDateTime usedAt;

      @CreationTimestamp 
      @Column(name = "created_at", nullable = false, updatable = false)
      private LocalDateTime createdAt;

      
      //constructor
      public PasswordReset() {
            
      }
      
      //--methods---
      public UUID getId() {
            return id;
      }

      public void setId(UUID id) {
            this.id = id;
      }
      
      public User getUser() {
            return user;
      }

      public void setUser(User user) {
            this.user = user;
      }

      public String getTokenHash() {
            return tokenHash;
      }

      public void setTokenHash(String tokenHash) {
            this.tokenHash = tokenHash;
      }

      public LocalDateTime getExpireAt() {
            return expireAt;
      }

      public void setExpireAt(LocalDateTime expireAt) {
            this.expireAt = expireAt;
      }

      public LocalDateTime getUsedAt() {
            return usedAt;
      }

      public void setUsedAt(LocalDateTime usedAt) {
            this.usedAt = usedAt;
      }

      public LocalDateTime getCreatedAt() {
            return createdAt;
      }

      public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
      }

}
