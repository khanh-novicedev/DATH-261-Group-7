package com.class2life.service.interaction;
import com.class2life.entity.NotificationType;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class NotificationService {
    public void notifyUser(UUID userId, NotificationType type, String content) {
        throw new UnsupportedOperationException("TODO: implement with NotificationRepository");
    }
}