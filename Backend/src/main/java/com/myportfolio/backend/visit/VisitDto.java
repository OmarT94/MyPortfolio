package com.myportfolio.backend.visit;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class VisitDto {

    // ─── Request: تسجيل زيارة جديدة ──────────────────────────────────────────
    @Data
    public static class LogRequest {
        private String companyToken;        // نتحقق منه لمعرفة الشركة
        private List<String> pagesViewed;   // الصفحات التي شاهدها
        private long durationSeconds;
    }

    // ─── Response: بيانات الزيارة ─────────────────────────────────────────────
    @Data
    public static class VisitResponse {
        private String id;
        private String companyId;
        private String companyName;
        private LocalDateTime timestamp;
        private List<String> pagesViewed;
        private long durationSeconds;
    }

    // ─── Response: إحصائيات لكل شركة (للـ Admin) ─────────────────────────────
    @Data
    public static class CompanyStats {
        private String companyId;
        private String companyName;
        private int totalVisits;
        private LocalDateTime lastVisit;
        private List<String> mostViewedPages;
    }
}