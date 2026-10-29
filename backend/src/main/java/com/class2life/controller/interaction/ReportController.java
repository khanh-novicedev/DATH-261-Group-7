package com.class2life.controller.interaction;

import com.class2life.common.ApiResponse;
import com.class2life.dto.interaction.*;
import com.class2life.service.interaction.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> create(@Valid @RequestBody CreateReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Report submitted", reportService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> list() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved", reportService.list()));
    }

    @PutMapping("/{reportId}/resolve")
    public ResponseEntity<ApiResponse<ReportResponse>> resolve(@PathVariable UUID reportId,
            @Valid @RequestBody ResolveReportRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Report resolved", reportService.resolve(reportId, request)));
    }
}
