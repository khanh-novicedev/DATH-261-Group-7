package com.class2life.dto.enrolment;

import com.class2life.entity.enrolment.CompletionStatus;
import com.class2life.entity.enrolment.Enrolment;

import java.time.LocalDateTime;
import java.util.UUID;

public record EnrolmentResponse(
        UUID enrolmentId,
        UUID courseId,
        CourseSummary course,
        CompletionStatus completionStatus,
        int progressPercent,
        UUID lastPositionLessonId,
        LocalDateTime enrolledAt,
        long completedLessons,
        long totalLessons
) {
    public record CourseSummary(UUID id, String title, String category) {}

    public static EnrolmentResponse from(Enrolment enrolment, long completedLessons, long totalLessons) {
        var course = enrolment.getCourse();
        var lastLesson = enrolment.getLastPositionLesson();
        int percent = totalLessons == 0 ? 0 : (int) (completedLessons * 100 / totalLessons);
        return new EnrolmentResponse(
                enrolment.getId(),
                course.getId(),
                new CourseSummary(course.getId(), course.getTitle(), course.getCategory()),
                enrolment.getCompletionStatus(),
                percent,
                lastLesson == null ? null : lastLesson.getId(),
                enrolment.getEnrolledAt(),
                completedLessons,
                totalLessons);
    }
}
