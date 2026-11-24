package com.class2life.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank
        String fullName
) {
}
