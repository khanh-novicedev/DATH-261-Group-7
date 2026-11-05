package com.class2life.dto.auth;

public record LoginResponse(String accessToken, long expiresIn, String refreshToken, AuthUserResponse user) {}
