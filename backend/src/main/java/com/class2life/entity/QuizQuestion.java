package com.class2life.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(name = "content", nullable = false, columnDefinition = "text")
    private String content;

    // The column has "default 1" in the schema, so the same default is set in Java
    @Column(name = "points", nullable = false)
    private Integer points = 1;

    // Required no-argument constructor
    public QuizQuestion() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
}