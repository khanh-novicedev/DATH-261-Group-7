package com.class2life.controller.assessment;

import com.class2life.common.ApiResponse;
import com.class2life.dto.assessment.AssignmentResponse;
import com.class2life.dto.assessment.CreateAssignmentRequest;
import com.class2life.dto.assessment.QuizQuestionResponse;
import com.class2life.service.assessment.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // API: POST /api/lessons/{lessonId}/assignments
    // Role: INSTRUCTOR (own courses only)
    // TODO: remove the instructorId request parameter and read the logged-in user from the
    // SecurityContext once the Leader finishes SecurityConfig; add the role rule at the same time
    @PostMapping("/lessons/{lessonId}/assignments")
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @PathVariable UUID lessonId,
            @RequestParam UUID instructorId,
            @Valid @RequestBody CreateAssignmentRequest request
    ) {
        AssignmentResponse response = assignmentService.createAssignment(lessonId, instructorId, request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Assignment created successfully", response), HttpStatus.CREATED);
    }

    // API: GET /api/lessons/{lessonId}/assignments
    @GetMapping("/lessons/{lessonId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByLesson(@PathVariable UUID lessonId) {
        List<AssignmentResponse> response = assignmentService.getAssignmentsByLesson(lessonId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignments retrieved successfully", response));
    }

    // API: GET /api/assignments/{assignmentId}/questions
    // The response never contains the is_correct flag
    @GetMapping("/assignments/{assignmentId}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestionResponse>>> getQuizQuestions(@PathVariable UUID assignmentId) {
        List<QuizQuestionResponse> response = assignmentService.getQuizQuestions(assignmentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Quiz questions retrieved successfully", response));
    }
}