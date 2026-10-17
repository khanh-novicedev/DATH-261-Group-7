package com.class2life.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity 
@Table(name = "lesson_qna")
public class LessonQna {
      
      @Id 
      @GeneratedValue (strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "lesson_id", nullable = false)
      private Lesson lesson;

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "author_id", nullable = false)
      private User author;

      */

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "parent_id")
      private LessonQna parent;
      
      @Column(name = "content", nullable = false, columnDefinition = "text")
      private String content;
      
      @CreationTimestamp 
      @Column(name = "created_at", nullable = false, updatable = false)
      private LocalDateTime createdAt;

      
      //constructor
      public LessonQna() {
            
      }
      
      //---methods---
      public UUID getId() {
            return id;
      }

      public void setId (UUID id) {
            this.id = id;
      }

      public LessonQna getParent() {
            return parent;
      }

      public void setParent(LessonQna parent) {
            this.parent = parent;
      }

      public String getContent() {
            return content;
      }

      public void setContent(String content) {
            this.content = content;
      }

      public LocalDateTime getCreatedAt() {
            return createdAt;
      }

      public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
      }

      /*
      
      public Lesson getLesson() {
            return lesson;
      }

      public void setLesson(Lesson lesson) {
            this.lesson = lesson;
      }

      public User getAuthor() {
            return author;
      }

      public void setAuthor(User author) {
            this.author = author;
      }

      */

}
