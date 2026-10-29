package com.class2life.dto.auth;

public record LoginResponse(
        String accessToken,
        long expiresIn,
        AuthUserResponse user
) {
}
