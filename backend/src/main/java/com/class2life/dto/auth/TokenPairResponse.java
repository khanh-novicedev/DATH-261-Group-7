package com.class2life.dto.auth;

public record TokenPairResponse(String accessToken, long expiresIn,
        String refreshToken, long refreshExpiresIn, AuthUserResponse user) {}