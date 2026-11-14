package com.class2life.mapper;

import com.class2life.dto.assessment.AssignmentResultsResponse.ResultItem;
import com.class2life.entity.assessment.QuizAttempt;
import com.class2life.entity.assessment.Submission;
import org.springframework.stereotype.Component;

@Component
public class ResultMapper {

    // Quiz attempt: attemptedAt becomes submittedAt; maxScore is passed in because it is not a column
    public ResultItem toResultItem(QuizAttempt attempt, int maxScore) {
        return new ResultItem(
                attempt.getId(),
                attempt.getTotalScore(),
                maxScore,
                attempt.getAttemptedAt(),
                null,
                null,
                null
        );
    }

    // File submission: a quiz has no maxScore, so it stays null
    public ResultItem toResultItem(Submission submission) {
        return new ResultItem(
                submission.getId(),
                submission.getScore(),
                null,
                submission.getSubmittedAt(),
                submission.getFileUrl(),
                submission.getFeedback(),
                submission.getGradedAt()
        );
    }
}
