package com.class2life.service.user;

import com.class2life.common.PageResponse;
import com.class2life.dto.user.*;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserStatus;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.user.UserRepository;
import com.class2life.repository.user.UserSpecifications;
import com.class2life.service.audit.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AdminAuditLogService adminAuditLogService;
    // Exact entity property names: the raw property goes to Spring Data, so the check must be case-sensitive.
    private static final Set<String> ALLOWED_SORTS = Set.of("id", "fullName", "email", "role", "status", "createdAt");

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getUsers(UserFilter filter, Pageable pageable) {
        for (Sort.Order order : pageable.getSort()) {
            if (!ALLOWED_SORTS.contains(order.getProperty())){
                throw new ApiException(ErrorCode.INVALID_SORT_FIELD, "Sort field Invalid");
            }
        }
        Specification<User> userKeywordSpecification = UserSpecifications.hasKeyword(filter.getKeyword());
        Specification<User> userRoleSpecification = UserSpecifications.hasRole(filter.getRole());
        Specification<User> userStatusSpecification = UserSpecifications.hasStatus(filter.getStatus());
        
        Specification<User> combinedSpecification = Specification.allOf(userKeywordSpecification, userRoleSpecification, userStatusSpecification);
        Page<User> page = userRepository.findAll(combinedSpecification, pageable);
        return PageResponse.of(page.map(UserSummaryResponse::toUserSummaryResponse));
    }
    @Transactional(readOnly = true)
    public UserSummaryResponse getMe(){
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED, "User not found"));
        return UserSummaryResponse.toUserSummaryResponse(user);
    }
    @Transactional
    public UserSummaryResponse updateMe(UpdateProfileRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED, "User not found"));
        user.setFullName(request.fullName());
        return UserSummaryResponse.toUserSummaryResponse(user);
    }
    @Transactional
    public UpdateUserStatusResponse changeStatus(UUID userId, UpdateUserStatusRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED, "User not found"));
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND, "User not found"));
        if (target.getId().equals(actor.getId())) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "Cannot change your own account status");
        }
        target.setStatus(request.status());

        String action = request.status() == UserStatus.SUSPENDED ? "SUSPEND_USER" : "REACTIVATE_USER";
        adminAuditLogService.writeAuditLog(actor, action, "USER", target.getId());

        return new UpdateUserStatusResponse(target.getId(), target.getStatus());
    }
    @Transactional(readOnly = true)
    public UserSummaryResponse findById(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND, "User not found"));
        return  UserSummaryResponse.toUserSummaryResponse(user);
    }
}