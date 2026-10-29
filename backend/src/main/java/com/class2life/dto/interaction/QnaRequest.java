package com.class2life.dto.interaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record QnaRequest(@NotBlank @Size(max = 10000) String content) {}