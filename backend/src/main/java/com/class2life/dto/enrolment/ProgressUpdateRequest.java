package com.class2life.dto.enrolment;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ProgressUpdateRequest(@NotNull UUID lessonId, @NotNull Boolean completed) {}