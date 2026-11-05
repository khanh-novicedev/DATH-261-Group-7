package com.class2life.dto.interaction;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResolveReportRequest(@NotNull ReportAction action, @Size(max = 255) String note) {}
