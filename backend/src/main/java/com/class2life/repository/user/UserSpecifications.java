package com.class2life.repository.user;

import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecifications {
    private UserSpecifications(){}
    public static Specification<User> hasKeyword(String inputKeyword) {
        // Purpose: WHERE fragment matching a keyword against full name OR email, case-insensitive.
        //   1. null/blank keyword -> cb.conjunction() (always true, adds no WHERE clause).
        //   2. else lower(full_name) LIKE '%kw%' OR lower(email) LIKE '%kw%'.
        // Does not page, sort or query — the service composes it.
        String keyword = inputKeyword == null ? "" : inputKeyword.trim().toLowerCase();

        return (root, query, criteriaBuilder) -> {
            if (keyword.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            Predicate nameMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fullName")), "%" + keyword + "%");
            Predicate emailMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")), "%" + keyword + "%");
            return criteriaBuilder.or(nameMatch, emailMatch);
        };
    }

    public static Specification<User> hasRole(UserRole role){
        // Purpose: WHERE fragment: role equals the given value (no-op when null)
        return (root, query, criteriaBuilder) -> {
            if (role == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("role"), role);
        };
    }
    public static Specification<User> hasStatus(UserStatus status){
        // Purpose: WHERE fragment: status equals the given value (no-op when null)
        return (root, query, criteriaBuilder) -> {
            if (status == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }
}
