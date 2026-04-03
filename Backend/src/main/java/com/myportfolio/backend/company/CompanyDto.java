package com.myportfolio.backend.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

// ─── Request: إنشاء شركة جديدة ───────────────────────────────────────────────
public class CompanyDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "اسم الشركة مطلوب")
        private String name;
        private int expiresInDays; // عدد أيام صلاحية الرابط (افتراضي 30 يوم)
        private String language; // اللغة التي تختارها للشركة
    }

    // ─── Response: بيانات الشركة للـ Admin ────────────────────────────────────
    @Data
    public static class AdminResponse {
        private String id;
        private String name;
        private String token;
        private String magicLink;       // الرابط الكامل
        private boolean isActive;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
        private int visitCount;
        private String language;
    }

    // ─── Request: تعديل حالة الرابط ──────────────────────────────────────────
    @Data
    public static class UpdateStatusRequest {
        private boolean isActive;
    }

    // ─── Response: التحقق من الرابط (للشركة) ─────────────────────────────────
    @Data
    public static class TokenValidResponse {
        private boolean valid;
        private String companyName;
        private String companyId;
    }
}