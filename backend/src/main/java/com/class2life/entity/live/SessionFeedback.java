package com.class2life.entity.live;

import com.class2life.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "session_feedbacks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "comment", columnDefinition = "text")
    private String comment;

    @Column(name = "rating")
    private Integer rating;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @JoinColumn(name = "session_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private LiveSession session;

    @JoinColumn(name = "learner_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User learner;

    @JoinColumn(name = "instructor_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User instructor;

}

