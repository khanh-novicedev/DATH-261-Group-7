package com.class2life.controller.live;

import com.class2life.common.ApiResponse;
import com.class2life.dto.live.CreateLiveSessionRequest;
import com.class2life.dto.live.LiveSessionResponse;
import com.class2life.service.live.LiveSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveSessionController {
    private final LiveSessionService liveSessionService;
    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LiveSessionResponse> createLiveSession(@Valid @RequestBody CreateLiveSessionRequest createLiveSessionRequest) {
        return new  ApiResponse<>(true, "Live Session Created", liveSessionService.createLiveSession(createLiveSessionRequest));
    }
}
