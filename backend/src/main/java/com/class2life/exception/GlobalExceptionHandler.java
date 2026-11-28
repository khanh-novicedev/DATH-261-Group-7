package com.class2life.exception;

import com.class2life.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Straight API Exception
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<?>> handleApiException(ApiException ex) {
        return errorResponse(ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        StringBuilder message = new StringBuilder();
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        for(FieldError fieldError : fieldErrors) {
            if (!message.isEmpty()){
                message.append(", ");
            }
            message.append(fieldError.getField());
            message.append(": ");
            message.append(fieldError.getDefaultMessage());
        }
        if (message.isEmpty()){
            return errorResponse(ErrorCode.VALIDATION_ERROR, "Validation Failed");
        }
        return errorResponse(ErrorCode.VALIDATION_ERROR, message.toString());
    }
    // Malform body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex){
        log.debug("Unreadable request body: {}", ex.getMessage());
        return errorResponse(ErrorCode.VALIDATION_ERROR, "Malformed or unreadable request body");
    }

    // Spring MVC's own client errors: keep them 4xx instead of falling into the catch-all 500.
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNoResourceFound(NoResourceFoundException ex) {
        return errorResponse(ErrorCode.RESOURCE_NOT_FOUND, "No endpoint " + ex.getHttpMethod() + " /" + ex.getResourcePath());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return errorResponse(ErrorCode.METHOD_NOT_ALLOWED, "Method " + ex.getMethod() + " is not supported for this endpoint");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<?>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return errorResponse(ErrorCode.VALIDATION_ERROR, "Invalid value for parameter '" + ex.getName() + "'");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<?>> handleMissingParameter(MissingServletRequestParameterException ex) {
        return errorResponse(ErrorCode.VALIDATION_ERROR, "Missing required parameter '" + ex.getParameterName() + "'");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<?>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return errorResponse(ErrorCode.INVALID_FILE, "File is too large");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception ex){
        // The client never sees the cause; the log is the only place it survives.
        log.error("Unhandled exception", ex);
        return errorResponse(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred");
    }
    // One place that builds every error response, so all handlers emit the same envelope.
    // The status is read from the code at call time; the code's name is the wire "errorCode".
    private static ResponseEntity<ApiResponse<?>> errorResponse(ErrorCode errorCode, String message) {
        if (message == null) {
            message = errorCode.name();
        }
        return ResponseEntity.status(errorCode.getStatus()).body(new ApiResponse<>(false, message, null, errorCode.name()));
    }
}
