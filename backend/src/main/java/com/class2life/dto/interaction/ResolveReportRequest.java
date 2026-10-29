package com.class2life.dto.interaction;

import jakarta.validation.constraints.NotBlank;

public record ResolveReportRequest(@NotBlank String action) {}
