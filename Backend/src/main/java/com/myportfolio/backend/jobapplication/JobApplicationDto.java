package com.myportfolio.backend.jobapplication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobApplicationDto {

    // ─── Request: إنشاء / تعديل ───────────────────────────────────────────────
    @Data
    public static class Request {
        @NotBlank(message = "Firmenname ist erforderlich")
        private String companyName;

        @NotBlank(message = "Stellenbezeichnung ist erforderlich")
        private String jobTitle;

        private String contactPerson;

        private LocalDate applicationDate;

        private JobApplication.Status status;

        private String notes;
    }

    // ─── Response ─────────────────────────────────────────────────────────────
    @Data
    public static class Response {
        private String id;
        private String companyName;
        private String jobTitle;
        private String contactPerson;
        private LocalDate applicationDate;
        private JobApplication.Status status;
        private String statusLabel;      // النص الألماني مع الإيموجي
        private String notes;
        private LocalDateTime createdAt;
    }

    // ─── Request: تحديث الحالة فقط ───────────────────────────────────────────
    @Data
    public static class UpdateStatusRequest {
        @NotNull
        private JobApplication.Status status;
    }

    // ─── Response: رابط PDF بعد الرفع لـ Cloudinary ──────────────────────────
    @Data
    public static class PdfResponse {
        private String pdfUrl;
        private String message;

        public PdfResponse(String pdfUrl, String message) {
            this.pdfUrl = pdfUrl;
            this.message = message;
        }
    }
}
