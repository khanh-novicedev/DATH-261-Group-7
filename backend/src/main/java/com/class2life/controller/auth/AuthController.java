package com.class2life.controller.auth;

import com.class2life.common.ApiResponse;
import com.class2life.dto.auth.*;
import com.class2life.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthUserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Registration successful", authService.register(request)));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return new ApiResponse<>(true, "Login successful", authService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return new ApiResponse<>(true, "Tokens refreshed", authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.refreshToken());
        return new ApiResponse<>(true, "Logged out successfully", (Void) null);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return new ApiResponse<>(true,
                "If an account exists for this email, a password-reset link will be sent.",
                Map.of("message", "Check your email for further instructions."));
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return new ApiResponse<>(true, "Password reset successfully", (Void) null);
    }
}



/*package com.class2life.controller.auth;

import com.class2life.common.ApiResponse;
import com.class2life.dto.auth.LoginRequest;
import com.class2life.dto.auth.LoginResponse;
import com.class2life.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse loginResponse  = authService.login(request);
        return new ApiResponse<>(true, "Login Successfully", loginResponse);
    }
}*/
