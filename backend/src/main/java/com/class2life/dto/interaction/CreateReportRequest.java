package com.class2life.dto.interaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateReportRequest(@NotBlank String reportedEntityType,
        @NotNull UUID reportedEntityId, @NotBlank @Size(max = 5000) String reason) {}
