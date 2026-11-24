package com.class2life.repository.audit;

import com.class2life.entity.user.AdminAuditLog;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public final class AdminAuditLogSpecifications {
    private  AdminAuditLogSpecifications() {}
    public static Specification<AdminAuditLog> hasAction(String inputAction) {
        String action = inputAction == null ? "" : inputAction.trim();
        return (root, query, cb) -> {
            if (action.isEmpty()){
                return cb.conjunction();
            }
            return cb.equal(root.get("action"), action);
        };
    }
    public static Specification<AdminAuditLog> hasActor(UUID actorId){
        return (root, query, criteriaBuilder) -> {
            if (actorId == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("actor").get("id"), actorId);
        };
    }
    public static Specification<AdminAuditLog> createdFrom(LocalDateTime from){
        return (root, query, criteriaBuilder) -> {
            if (from == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from);
        };
    }
    public static Specification<AdminAuditLog> createdTo(LocalDateTime to){
        return (root, query, criteriaBuilder) -> {
            if (to == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), to);
        };
    }
}
