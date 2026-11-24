package com.class2life.service.audit;

import com.class2life.common.PageResponse;
import com.class2life.dto.audit.AdminAuditLogFilter;
import com.class2life.dto.audit.AdminAuditLogResponse;
import com.class2life.entity.user.AdminAuditLog;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.audit.AdminAuditLogRepository;
import com.class2life.repository.audit.AdminAuditLogSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAuditLogService {
    private final AdminAuditLogRepository adminAuditLogRepository;
    private static final String ALLOWED_SORT = "createdAt";
    @Transactional(propagation = Propagation.MANDATORY)
    public void writeAuditLog(User actor, String action, String entityType, UUID entityId){
        AdminAuditLog adminAuditLog = AdminAuditLog.builder().action(action).entityType(entityType).entityId(entityId).actor(actor).build();
        adminAuditLogRepository.save(adminAuditLog);
    }
//    @Transactional(readOnly = true)
//    public PageResponse<UserSummaryResponse> getUsers(UserFilter filter, Pageable pageable) {
//        for (Sort.Order order : pageable.getSort()) {
//            if (!ALLOWED_SORTS.contains(order.getProperty().toLowerCase())){
//                throw new ApiException(ErrorCode.INVALID_SORT_FIELD, "Sort field Invalid");
//            }
//        }
//        Specification<User> userKeywordSpecification = UserSpecifications.hasKeyword(filter.getKeyword());
//        Specification<User> userRoleSpecification = UserSpecifications.hasRole(filter.getRole());
//        Specification<User> userStatusSpecification = UserSpecifications.hasStatus(filter.getStatus());
//
//        Specification<User> combinedSpecification = Specification.allOf(userKeywordSpecification, userRoleSpecification, userStatusSpecification);
//        Page<User> page = userRepository.findAll(combinedSpecification, pageable);
//        return PageResponse.of(page.map(UserSummaryResponse::toUserSummaryResponse));
//    }
    @Transactional(readOnly = true)
    public Page<AdminAuditLogResponse> getAdminAuditLogs(AdminAuditLogFilter filter, Pageable pageable){
        for (Sort.Order order : pageable.getSort()) {
            if (!ALLOWED_SORT.equals(order.getProperty())) {
                throw new ApiException(ErrorCode.INVALID_SORT_FIELD, "Sort field Invalid");
            }
        }
        Specification<AdminAuditLog> logFromSpecification = AdminAuditLogSpecifications.createdFrom(filter.from());
        Specification<AdminAuditLog> logToSpecification = AdminAuditLogSpecifications.createdTo(filter.to());
        Specification<AdminAuditLog> logActionSpecification = AdminAuditLogSpecifications.hasAction(filter.action());
        Specification<AdminAuditLog> logActorIdSpecification = AdminAuditLogSpecifications.hasActor(filter.actorId());

        Specification<AdminAuditLog> combinedSpecification = Specification.allOf(logFromSpecification, logToSpecification, logActionSpecification, logActorIdSpecification);
        Page<AdminAuditLog> adminAuditLogs = adminAuditLogRepository.findAll(combinedSpecification, pageable);
        return adminAuditLogs.map(AdminAuditLogResponse::toAdminAuditLogResponse);
    }
}
