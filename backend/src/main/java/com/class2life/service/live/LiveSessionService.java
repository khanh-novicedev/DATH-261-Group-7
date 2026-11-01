package com.class2life.service.live;

import com.class2life.dto.live.CreateLiveSessionRequest;
import com.class2life.dto.live.LiveSessionResponse;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.live.BreakoutRoom;
import com.class2life.entity.live.LiveSession;
import com.class2life.entity.live.SessionStatus;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.live.BreakoutRoomRepository;
import com.class2life.repository.live.LiveSessionRepository;
import com.class2life.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LiveSessionService {
    private final LiveSessionRepository liveSessionRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final BreakoutRoomRepository breakoutRoomRepository ;
    @Transactional
    public LiveSessionResponse createLiveSession(CreateLiveSessionRequest createLiveSessionRequest) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        Lesson lesson = lessonRepository.findById(createLiveSessionRequest.lessonId()).orElseThrow(() -> new ApiException(ErrorCode.LESSON_NOT_FOUND));
        LiveSession liveSession = LiveSession.builder().lesson(lesson).host(user).scheduledTime(createLiveSessionRequest.scheduledTime()).build();
        liveSessionRepository.save(liveSession);
        BreakoutRoom breakoutRoom = BreakoutRoom.builder().name("Main").session(liveSession).build();
        breakoutRoomRepository.save(breakoutRoom);
        return LiveSessionResponse.fromSessionToLiveSessionResponse(liveSession);
    }
}
