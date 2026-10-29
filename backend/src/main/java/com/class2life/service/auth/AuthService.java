package com.class2life.service.auth;

import com.class2life.dto.auth.AuthUserResponse;
import com.class2life.dto.auth.LoginRequest;
import com.class2life.dto.auth.LoginResponse;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.user.UserRepository;
import com.class2life.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow(
                () -> new ApiException(ErrorCode.INVALID_CREDENTIALS, "User not found")
        );

        if (!passwordEncoder.matches(loginRequest.password(), user.getPasswordHash() )){
            throw new ApiException(ErrorCode.INVALID_CREDENTIALS, "Wrong password");
        }
        if (user.getStatus() == UserStatus.SUSPENDED){
            throw new ApiException(ErrorCode.ACCOUNT_SUSPENDED, "Account Suspended");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        AuthUserResponse authUserResponse = new AuthUserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
        LoginResponse loginResponse = new LoginResponse(token, jwtService.getExpirationSeconds(), authUserResponse);
        return loginResponse;
    }
}
