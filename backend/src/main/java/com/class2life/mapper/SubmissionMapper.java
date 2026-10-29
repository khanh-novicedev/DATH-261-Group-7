package com.class2life.mapper;

import com.class2life.dto.assessment.SubmissionResponse;
import com.class2life.entity.assessment.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public SubmissionResponse toSubmissionResponse(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getAssignment().getId(),
                submission.getUser().getId(),
                submission.getUser().getFullName(),
                submission.getFileUrl(),
                submission.getScore(),
                submission.getFeedback(),
                submission.getGradedBy() == null ? null : submission.getGradedBy().getId(),
                submission.getSubmittedAt(),
                submission.getGradedAt()
        );
    }
}