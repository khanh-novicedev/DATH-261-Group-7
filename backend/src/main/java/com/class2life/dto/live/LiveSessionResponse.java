package com.class2life.dto.live;

import com.class2life.entity.live.LiveSession;
import com.class2life.entity.live.SessionStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record LiveSessionResponse(
        UUID id,
        UUID lessonId,
        UUID hostId,
        LocalDateTime scheduledTime,
        SessionStatus sessionStatus,
        LocalDateTime createdAt
) {
    public static LiveSessionResponse fromSessionToLiveSessionResponse(LiveSession liveSession) {
        return new LiveSessionResponse(liveSession.getId(), liveSession.getLesson().getId(), liveSession.getHost().getId(), liveSession.getScheduledTime(), liveSession.getSessionStatus(), liveSession.getCreatedAt());
    }
}
