package com.class2life.dto.live;

import com.class2life.entity.live.RoomMessage;

import java.time.LocalDateTime;
import java.util.UUID;

public record RoomMessageResponse(
        UUID sessionID,
        String senderName,
        String content,
        LocalDateTime sentAt

) {
    public static RoomMessageResponse from(RoomMessage roomMessage, UUID sessionId) {
        return new RoomMessageResponse(sessionId, roomMessage.getUser().getFullName(), roomMessage.getContent(), roomMessage.getSentAt());
    }
}
