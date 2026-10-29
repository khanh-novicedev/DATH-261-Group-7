package com.class2life.service.interaction;

import com.class2life.dto.interaction.NotificationResponse;
import com.class2life.entity.interaction.Notification;
import com.class2life.entity.interaction.NotificationType;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.interaction.NotificationRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void notifyUser(UUID userId, NotificationType type, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setContent(content);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {
        User user = currentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public NotificationResponse markRead(UUID notificationId) {
        User user = currentUser();
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public int markAllRead() {
        User user = currentUser();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        int changed = 0;
        for (Notification n : notifications) {
            if (!Boolean.TRUE.equals(n.getIsRead())) {
                n.setIsRead(true);
                changed++;
            }
        }
        notificationRepository.saveAll(notifications);
        return changed;
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(n.getId(), n.getType(), n.getContent(),
                Boolean.TRUE.equals(n.getIsRead()), n.getCreatedAt());
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName()))
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}


/*package com.class2life.service.interaction;
import com.class2life.entity.interaction.NotificationType;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class NotificationService {
    public void notifyUser(UUID userId, NotificationType type, String content) {
        throw new UnsupportedOperationException);
    }
}*/