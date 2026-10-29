package com.class2life.controller.interaction;

import com.class2life.common.ApiResponse;
import com.class2life.dto.interaction.NotificationResponse;
import com.class2life.service.interaction.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications retrieved", notificationService.getMyNotifications()));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markRead(@PathVariable UUID notificationId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read", notificationService.markRead(notificationId)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllRead() {
        int updated = notificationService.markAllRead();
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications marked as read", Map.of("updatedCount", updated)));
    }
}