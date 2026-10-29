package com.class2life.security;

import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFiller extends OncePerRequestFilter {
    //  Build a filter that reads the Bearer token, verifies it,
    //  and installs the caller's identity + role into the SecurityContext.

    // Purpose: On every request, turn Jwt back into a "logged-in" user that Spring Security can see
    // Why needed: JWT Is stateless, nothing in server remember the user, so every request carry the token, and the filter must re-establish "who you are" from scratch every time.
    // 2 jobs: Extract and verify Authorization: Bearer<token>, delegate the checking to JwtService.parseToken
    // Install identity, build the Authentication holding the email and ROLE_<role>, and put it in SecurityContextHolder.
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Read Authorization: Bearer <token>, strip the bearer substr to get the actual token
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.substring(7);
        Claims tokenClaims;
        try {
            tokenClaims = jwtService.parseToken(token);
        } catch (JwtException | IllegalArgumentException e) {
            filterChain.doFilter(request, response);
            return;
        }

        String role = tokenClaims.get("role", String.class);
        String email = tokenClaims.getSubject();
        // build authority list
        // an authority is a named permission string attached to the authenticated user — like "ROLE_ADMIN" — that the authorization rules match against to decide allow or deny.
        // It's how "what this user is allowed to do" gets represented in the request.
        List<SimpleGrantedAuthority> authorityList = List.of(new SimpleGrantedAuthority("ROLE_" + role));

        // Authentication: placeholder of 3 fields: principal: who(email), credentials(proof, already verified), authorities(ROLE_*)
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, authorityList);
        SecurityContextHolder.getContext().setAuthentication(auth);
        filterChain.doFilter(request, response);

    }
}
