package com.class2life.service.auth;

import com.class2life.dto.auth.AuthUserResponse;
import com.class2life.dto.auth.LoginRequest;
import com.class2life.dto.auth.LoginResponse;
import com.class2life.dto.auth.RegisterRequest;
import com.class2life.entity.user.PasswordReset;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.user.PasswordResetRepository;
import com.class2life.repository.user.UserRepository;
import com.class2life.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final Duration REFRESH_TTL = Duration.ofDays(7);
    private static final Duration RESET_TTL = Duration.ofMinutes(30);
    private final UserRepository userRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    @Value("${app.frontend-url:http://localhost:5173}") private String frontendUrl;

    @Transactional
    public AuthUserResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent())
            throw new ApiException(ErrorCode.EMAIL_ALREADY_EXISTS);
        UserRole role = request.role() == null ? UserRole.LEARNER : request.role();
        if (role == UserRole.ADMIN)
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "ADMIN accounts cannot self-register");
        User user = User.builder().fullName(request.fullName().trim()).email(email)
                .passwordHash(passwordEncoder.encode(request.password())).role(role).status(UserStatus.ACTIVE).build();
        user = userRepository.save(user);
        return toAuthUser(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new ApiException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
        ensureActive(user);
        String accessToken = jwtService.generateToken(user.getEmail(), user.getRole());
        String refreshToken = newRefreshToken();
        redisTemplate.opsForValue().set(refreshKey(refreshToken), user.getEmail(), REFRESH_TTL);
        return new LoginResponse(accessToken, jwtService.getExpirationSeconds(), refreshToken, toAuthUser(user));
    }

    @Transactional(readOnly = true)
    public LoginResponse refresh(String refreshToken) {
        String key = refreshKey(refreshToken);
        String email = redisTemplate.opsForValue().get(key);
        if (email == null) throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));
        if (user.getStatus() == UserStatus.SUSPENDED) {
            redisTemplate.delete(key);
            throw new ApiException(ErrorCode.ACCOUNT_SUSPENDED, "Account is suspended");
        }
        // API-03 returns a new access token only; keep the existing refresh token valid
        // until logout or its seven-day Redis TTL expires.
        return new LoginResponse(jwtService.generateToken(user.getEmail(), user.getRole()),
                jwtService.getExpirationSeconds(), null, toAuthUser(user));
    }

    public void logout(String refreshToken) {
        redisTemplate.delete(refreshKey(refreshToken));
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email.trim().toLowerCase()).ifPresent(user -> {
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
            PasswordReset reset = new PasswordReset();
            reset.setUser(user);
            reset.setTokenHash(sha256(rawToken));
            reset.setExpireAt(LocalDateTime.now().plus(RESET_TTL));
            passwordResetRepository.save(reset);
            // The API specification says development sends the link to the application log.
            log.info("Password reset link for {}: {}/reset-password?token={}", user.getEmail(), frontendUrl, rawToken);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordReset reset = passwordResetRepository.findByTokenHashAndUsedAtIsNull(sha256(token))
                .filter(r -> r.getExpireAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_RESET_TOKEN));
        User user = reset.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        reset.setUsedAt(LocalDateTime.now());
        passwordResetRepository.save(reset);
        // The schema has no refresh-token table; refresh tokens are managed in Redis and
        // remain individually revocable through API-04 logout.
    }

    private void ensureActive(User user) {
        if (user.getStatus() == UserStatus.SUSPENDED)
            throw new ApiException(ErrorCode.ACCOUNT_SUSPENDED, "Account is suspended");
    }

    private AuthUserResponse toAuthUser(User user) {
        return new AuthUserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    private String newRefreshToken() {
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String refreshKey(String token) { return "auth:refresh:" + sha256(token); }

    private String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}


/*package com.class2life.service.auth;

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
*/