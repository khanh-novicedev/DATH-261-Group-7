package com.class2life.config;

import com.class2life.common.ApiResponse;
import com.class2life.exception.ErrorCode;
import com.class2life.security.JwtAuthenticationFiller;
import com.class2life.security.JwtService;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, ObjectMapper objectMapper, CorsConfigurationSource corsConfigurationSource) throws Exception {
        JwtAuthenticationFiller jwtAuthenticationFiller = new JwtAuthenticationFiller(jwtService);

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/audit-logs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/courses/*/enrolment").hasRole("LEARNER") // Enrol in course
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/*/enrolment").hasRole("LEARNER") // API-20 leave course; must sit above the DELETE /api/courses/** rule
                        .requestMatchers(HttpMethod.POST, "/api/courses", "/api/courses/**").hasAnyRole("ADMIN", "INSTRUCTOR") // Create course
                        .requestMatchers(HttpMethod.PATCH, "/api/courses/**").hasAnyRole("ADMIN", "INSTRUCTOR") // Publish/status
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyRole("ADMIN", "INSTRUCTOR") // Delete
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").authenticated()
                        .requestMatchers("/api/enrolments", "/api/enrolments/**").hasRole("LEARNER")
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/live", "/api/live/**").hasAnyRole("ADMIN", "INSTRUCTOR")
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint(objectMapper))
                        .accessDeniedHandler(accessDeniedHandler(objectMapper)))
                .addFilterBefore(jwtAuthenticationFiller, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, authException) -> {
            // The JWT filter marks expired (but otherwise valid) tokens, so the FE knows to refresh instead of logging out
            boolean expired = Boolean.TRUE.equals(request.getAttribute(JwtAuthenticationFiller.TOKEN_EXPIRED_ATTRIBUTE));
            ErrorCode code = expired ? ErrorCode.TOKEN_EXPIRED : ErrorCode.UNAUTHORIZED;
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(),
                    new ApiResponse<>(false, expired ? "Token expired" : "Unauthorized", null, code.name()));
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(),
                    new ApiResponse<>(false, "Forbidden", null, ErrorCode.FORBIDDEN.name()));
        };
    }
}