package com.class2life.dto.enrolment;

import jakarta.validation.constraints.NotNull;

public record UpdateLessonProgressRequest(@NotNull Boolean isCompleted) {}