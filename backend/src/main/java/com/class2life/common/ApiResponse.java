package com.class2life.common;

import com.fasterxml.jackson.annotation.JsonInclude;

// Ẩn các trường null (ví dụ khi thành công thì không hiện errorCode)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        String errorCode
) {
    // Constructor dùng cho trường hợp gọi API Thành công
    public ApiResponse(boolean success, String message, T data) {
        this(success, message, data, null);
    }

    // Constructor dùng cho trường hợp gọi API Thất bại (Lỗi)
    public ApiResponse(boolean success, String message, String errorCode) {
        this(success, message, null, errorCode);
    }
}