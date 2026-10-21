package com.class2life.entity.live;

import com.class2life.entity.course.Lesson;
import com.class2life.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "live_sessions")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LiveSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JoinColumn(name = "lesson_id",  nullable = false )
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Lesson lesson;

    @JoinColumn(name = "host_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User host;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;

    @Column(name = "status", nullable = false)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SessionStatus sessionStatus = SessionStatus.SCHEDULED;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
