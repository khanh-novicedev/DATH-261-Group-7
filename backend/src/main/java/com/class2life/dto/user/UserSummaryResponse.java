package com.class2life.dto.user;

import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
@Getter
@Setter
public class UserSummaryResponse {
    private UUID id;

    private String fullName;

    private String email;

    private UserRole role;

    private UserStatus status;

    private LocalDateTime createdAt;

    public static UserSummaryResponse toUserSummaryResponse(User user) {
        UserSummaryResponse response = new UserSummaryResponse();   // the `new` lives here, not at the call site
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
