package com.class2life.controller.live;

import com.class2life.dto.live.RoomMessageRequest;
import com.class2life.dto.live.RoomMessageResponse;
import com.class2life.entity.live.BreakoutRoom;
import com.class2life.entity.live.RoomMessage;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.live.BreakoutRoomRepository;
import com.class2life.repository.live.LiveSessionRepository;
import com.class2life.repository.live.RoomMessageRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Transactional
public class LiveChatController {
    // Add one @Controller that receives a chat message over STOMP, persists it to a RoomMessage, and broadcasts it to everyone subscribed to that session's topic.
    private final BreakoutRoomRepository breakoutRoomRepository;
    private final RoomMessageRepository roomMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    // Only map STOMP so APiException wont map here
    @MessageMapping("/session/{sessionId}/chat")
    public void livechatHandling(@Payload RoomMessageRequest request, @DestinationVariable UUID sessionId, Principal principal) {
        BreakoutRoom mainRoom = breakoutRoomRepository.findFirstBySessionIdOrderByCreatedAtAsc(sessionId).get();

        User user;
        if (principal != null) {
            user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        } else {
            user = mainRoom.getSession().getHost();
        }
        RoomMessage roomMessage = RoomMessage.builder().content(request.content()).room(mainRoom).user(user).build();
        roomMessageRepository.save(roomMessage);
        RoomMessageResponse response = RoomMessageResponse.from(roomMessage, sessionId);
        simpMessagingTemplate.convertAndSend("/topic/session/" + sessionId + "/chat", response);
    }
}
