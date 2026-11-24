package com.class2life.controller.audit;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.audit.AdminAuditLogFilter;
import com.class2life.dto.audit.AdminAuditLogResponse;
import com.class2life.service.audit.AdminAuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AdminAuditLogController {
    private final AdminAuditLogService adminAuditLogService;
    @GetMapping
    public ApiResponse<PageResponse<AdminAuditLogResponse>> getAdminAuditLogs(@Valid @ModelAttribute AdminAuditLogFilter filter, @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return new ApiResponse<>(true, "AdminAuditLog Retrieved Successfully", PageResponse.of(adminAuditLogService.getAdminAuditLogs(filter, pageable)));
    }
}

