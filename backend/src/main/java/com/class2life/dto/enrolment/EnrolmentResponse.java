package com.class2life.dto.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import com.class2life.entity.enrolment.Enrolment;

import java.time.LocalDateTime;
import java.util.UUID;

public record EnrolmentResponse(
        UUID enrolmentId,
        UUID courseId,
        CompletionStatus completionStatus,
        LocalDateTime enrolledAt
) {
    public static EnrolmentResponse from(Enrolment enrolment){
        return  new EnrolmentResponse(enrolment.getId(), enrolment.getCourse().getId(), enrolment.getCompletionStatus(), enrolment.getEnrolledAt());
    }
}
