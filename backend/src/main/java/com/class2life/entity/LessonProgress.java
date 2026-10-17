package com.class2life.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity 
@Table(name = "lesson_progress")
public class LessonProgress {
      
      @Id 
      @GeneratedValue(strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "enrolment_id", nullable = false)
      private Enrolment enrolment;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "lesson_id", nullable = false)
      private Lesson lesson;

      */

      @Column(name = "is_completed", nullable = false)
      private Boolean isCompleted = false;

      @Column(name = "completed_at") 
      private LocalDateTime completedAt;

      
      
      //constructor
      public LessonProgress() {
            
      }
      
      //----method---
      public UUID getId() {
            return id;
      }

      public void setId(UUID id) {
            this.id = id;
      }

      public Enrolment getEnrolment() {
            return enrolment;
      }

      public void setEnrolment(Enrolment enrolment) {
            this.enrolment = enrolment;
      }

      public Boolean getIsCompleted() {
            return isCompleted;
      }

      public void setIsCompleted(Boolean isCompleted) {
            this.isCompleted = isCompleted;
      }

      public LocalDateTime getCompletedAt() {
            return completedAt;
      }

      public void setCompletedAt(LocalDateTime completedAt) {
            this.completedAt = completedAt;
      }

      /*
      
      public Lesson getLesson() {
            return lesson;
      }

      public void setLesson(Lesson lesson) {
            this.lesson = lesson;
      }

      */

}
