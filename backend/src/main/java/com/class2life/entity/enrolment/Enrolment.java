package com.class2life.entity.enrolment;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity 
@Table(name = "enrolments")
public class Enrolment {

      @Id
      @GeneratedValue (strategy = GenerationType.UUID)
      @Column(name = "id", nullable = false)
      private UUID id;

      /* 

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "user_id", nullable = false)
      private User user;
      
      @ManyToOne(fetch = fetch.LAZY)
      @JoinColumn(name = "course_id", nullable = false)
      private Course course; 
      
      */

      @Enumerated(EnumType.STRING)
      @JdbcTypeCode(SqlTypes.NAMED_ENUM)
      @Column(name = "completion_status", nullable = false)
      private CompletionStatus completionStatus = CompletionStatus.IN_PROGRESS;

      /*
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "last_position_lesson_id")
      private Lesson lastPositionLesson;

      */

      @CreationTimestamp 
      @Column(name = "enrolled_at", nullable = false, updatable = false)
      private LocalDateTime enrolledAt;


      

      //constructor
      public Enrolment() {
           
      }

      // ----methodds-----
      public UUID getId() {
            return id;
      }

      public void setId (UUID id) {
            this.id = id;
      }

      public CompletionStatus getCompletionStatus() {
            return completionStatus;
      }

      public void setCompletionStatus(CompletionStatus completionStatus) {
            this.completionStatus = completionStatus;
      }

      public LocalDateTime getEnrolledAt() {
            return enrolledAt;
      }

      public void setEnrolledAt(LocalDateTime enrolledAt) {
            this.enrolledAt = enrolledAt;
      }

      /*
      
      public User getUser() {
            return user;      
      }

      public void setUser(User user) {
            this.user = user;      
      }

      public Course getCourse() {
            return course;
      }

      public void setCourse(Course course) {
            this.course = course;
      }

      public Lesson getLastPositionLesson() {
            return lastPositionLesson;
      }

      public void setLastPositionLesson(Lesson lastPositionLesson) {
            this.lastPositionLesson = lastPositionLesson;
      }

      */

}
