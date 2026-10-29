package com.class2life.controller.interaction;

import com.class2life.common.ApiResponse;
import com.class2life.dto.interaction.QnaRequest;
import com.class2life.dto.interaction.QnaResponse;
import com.class2life.service.interaction.LessonQnaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LessonQnaController {
    private final LessonQnaService qnaService;

    @GetMapping("/api/lessons/{lessonId}/qna")
    public ResponseEntity<ApiResponse<List<QnaResponse>>> list(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Lesson Q&A retrieved", qnaService.list(lessonId)));
    }

    @PostMapping("/api/lessons/{lessonId}/qna")
    public ResponseEntity<ApiResponse<QnaResponse>> ask(@PathVariable UUID lessonId,
            @Valid @RequestBody QnaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Question created", qnaService.ask(lessonId, request)));
    }

    @PostMapping("/api/qna/{qnaId}/replies")
    public ResponseEntity<ApiResponse<QnaResponse>> reply(@PathVariable UUID qnaId,
            @Valid @RequestBody QnaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Reply created", qnaService.reply(qnaId, request)));
    }
}
