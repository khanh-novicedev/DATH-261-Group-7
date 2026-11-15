package com.class2life.controller.assessment;

import com.class2life.common.ApiResponse;
import com.class2life.dto.assessment.AssignmentResultsResponse;
import com.class2life.service.assessment.AssignmentResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AssignmentResultController {

    private final AssignmentResultService assignmentResultService;

    public AssignmentResultController(AssignmentResultService assignmentResultService) {
        this.assignmentResultService = assignmentResultService;
    }

    // API-32: GET /api/assignments/{assignmentId}/results
    // Role: LEARNER. The user comes from the token, never from the client.
    @GetMapping("/assignments/{assignmentId}/results")
    public ResponseEntity<ApiResponse<AssignmentResultsResponse>> getMyResults(@PathVariable UUID assignmentId) {
        AssignmentResultsResponse response = assignmentResultService.getMyResults(assignmentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Results retrieved successfully", response));
    }
}
