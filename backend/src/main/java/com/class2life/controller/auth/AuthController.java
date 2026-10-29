package com.class2life.controller.auth;

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
}
