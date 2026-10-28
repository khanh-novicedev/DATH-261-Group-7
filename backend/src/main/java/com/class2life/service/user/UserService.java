package com.class2life.service.user;

import com.class2life.common.PageResponse;
import com.class2life.dto.user.UserFilter;
import com.class2life.dto.user.UserSummaryResponse;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.user.UserRepository;
import com.class2life.repository.user.UserSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private static final Set<String> ALLOWED_SORTS = Set.of("id", "fullname", "email", "role", "status", "createdat");

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponse> getUsers(UserFilter filter, Pageable pageable) {
        for (Sort.Order order : pageable.getSort()) {
            if (!ALLOWED_SORTS.contains(order.getProperty().toLowerCase())){
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
}
