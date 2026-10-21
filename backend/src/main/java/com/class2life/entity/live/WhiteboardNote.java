package com.class2life.entity.live;

import com.class2life.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "whiteboard_notes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardNote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "pos_x", nullable = false)
    private Double posX;

    @Column(name = "pos_y", nullable = false)
    private Double posY;

    @Column(name = "color")
    private String color;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @JoinColumn(name = "room_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private BreakoutRoom room;

    @JoinColumn(name = "created_by", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User createdBy;
}

