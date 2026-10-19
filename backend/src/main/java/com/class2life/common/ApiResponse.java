package com.class2life.common;

import com.fasterxml.jackson.annotation.JsonInclude;

// Ẩn các trường null (ví dụ khi thành công thì không hiện errorCode)
// Omit null attributes
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        String errorCode
) {
    // Success case API Response
    public ApiResponse(boolean success, String message, T data) {
        this(success, message, data, null);
    }

    // Failed case API Response
    public ApiResponse(boolean success, String message, String errorCode) {
        this(success, message, null, errorCode);
    }
}