package com.class2life.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "quiz_options")
public class QuizOption {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Column(name = "content", nullable = false, columnDefinition = "text")
    private String content;

    // The column has "default false" in the schema, so the same default is set in Java.
    // This value must never be exposed in a learner-facing response DTO.
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    // Required no-argument constructor
    public QuizOption() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public QuizQuestion getQuestion() { return question; }
    public void setQuestion(QuizQuestion question) { this.question = question; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
}