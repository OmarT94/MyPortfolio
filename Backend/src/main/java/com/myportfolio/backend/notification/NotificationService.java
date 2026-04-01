package com.myportfolio.backend.notification;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepo notificationRepo,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepo = notificationRepo;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener  // يستمع تلقائياً لأي حدث من نوع NotificationEvent
    public void handleNotificationEvent(NotificationEvent event) {
        createNotification(event.getMessage());
    }

    public void createNotification(String message) {
        Notification notification = Notification.builder()
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        Notification saved = notificationRepo.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications", mapToResponse(saved));
    }

    public List<NotificationDto.NotificationResponse> getAllNotifications() {
        return notificationRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public NotificationDto.UnreadCountResponse getUnreadCount() {
        NotificationDto.UnreadCountResponse response = new NotificationDto.UnreadCountResponse();
        response.setCount(notificationRepo.countByIsReadFalse());
        return response;
    }

    public void markAsRead(String id) {
        notificationRepo.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepo.save(n);
        });
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepo.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(unread);
    }

    private NotificationDto.NotificationResponse mapToResponse(Notification n) {
        NotificationDto.NotificationResponse response = new NotificationDto.NotificationResponse();
        response.setId(n.getId());
        response.setMessage(n.getMessage());
        response.setRead(n.isRead());
        response.setCreatedAt(n.getCreatedAt());
        return response;
    }
}