package com.class2life.mapper;

import com.class2life.dto.assessment.QuizAttemptResponse;
import com.class2life.entity.assessment.QuizAttempt;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class QuizMapper {

    // maxScore and passScore are passed in because they are not columns of quiz_attempts
    public QuizAttemptResponse toQuizAttemptResponse(QuizAttempt attempt, int maxScore, Integer passScore) {
        Boolean passed = null;
        if (passScore != null && attempt.getTotalScore() != null) {
            passed = attempt.getTotalScore().compareTo(BigDecimal.valueOf(passScore)) >= 0;
        }
        return new QuizAttemptResponse(
                attempt.getId(),
                attempt.getAssignment().getId(),
                attempt.getTotalScore(),
                maxScore,
                passed,
                attempt.getAttemptedAt()
        );
    }
}