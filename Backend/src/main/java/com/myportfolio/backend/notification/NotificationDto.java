package com.myportfolio.backend.notification;

import lombok.Data;

import java.time.LocalDateTime;

public class NotificationDto {

    // ─── Response: بيانات الإشعار ─────────────────────────────────────────────
    @Data
    public static class NotificationResponse {
        private String id;
        private String message;
        private boolean isRead;
        private LocalDateTime createdAt;
    }

    // ─── Response: عدد الإشعارات غير المقروءة ────────────────────────────────
    @Data
    public static class UnreadCountResponse {
        private long count;
    }
}