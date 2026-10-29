package com.class2life.controller.assessment;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.assessment.GradeSubmissionRequest;
import com.class2life.dto.assessment.SubmissionResponse;
import com.class2life.service.assessment.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // API: POST /api/assignments/{assignmentId}/submissions (multipart/form-data, part name "file")
    // Role: LEARNER
    // TODO: remove the userId request parameter and read the logged-in user from the SecurityContext
    // once the Leader finishes SecurityConfig; add the role rule at the same time
    @PostMapping(value = "/assignments/{assignmentId}/submissions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitFile(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId,
            @RequestParam("file") MultipartFile file
    ) {
        SubmissionResponse response = submissionService.submitFile(assignmentId, userId, file);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "File submitted successfully", response), HttpStatus.CREATED);
    }

    // API: GET /api/assignments/{assignmentId}/submissions/me?page=0&size=10
    // Submission history and results of the logged-in learner, newest first
    // TODO: same as above, the userId comes from the SecurityContext later
    @GetMapping("/assignments/{assignmentId}/submissions/me")
    public ResponseEntity<ApiResponse<PageResponse<SubmissionResponse>>> getMySubmissions(
            @PathVariable UUID assignmentId,
            @RequestParam UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<SubmissionResponse> response = submissionService.getMySubmissions(assignmentId, userId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Submissions retrieved successfully", response));
    }

    // API: GET /api/assignments/{assignmentId}/submissions?page=0&size=10
    // Role: INSTRUCTOR (own courses only). Returns the latest submission of each learner.
    // TODO: the instructorId comes from the SecurityContext later
    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<ApiResponse<PageResponse<SubmissionResponse>>> getLatestSubmissions(
            @PathVariable UUID assignmentId,
            @RequestParam UUID instructorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<SubmissionResponse> response =
                submissionService.getLatestSubmissions(assignmentId, instructorId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Submissions retrieved successfully", response));
    }

    // API: PATCH /api/submissions/{submissionId}/grade
    // Role: INSTRUCTOR (own courses only)
    // TODO: the instructorId comes from the SecurityContext later
    @PatchMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<ApiResponse<SubmissionResponse>> gradeSubmission(
            @PathVariable UUID submissionId,
            @RequestParam UUID instructorId,
            @Valid @RequestBody GradeSubmissionRequest request
    ) {
        SubmissionResponse response = submissionService.gradeSubmission(submissionId, instructorId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Submission graded successfully", response));
    }
}