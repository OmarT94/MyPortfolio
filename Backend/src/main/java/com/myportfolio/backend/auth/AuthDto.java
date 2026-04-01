package com.myportfolio.backend.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDto {

    // ─── Request: تسجيل دخول الـ Admin ───────────────────────────────────────
    @Data
    public static class LoginRequest {
        @NotBlank(message = "اسم المستخدم مطلوب")
        private String username;

        @NotBlank(message = "كلمة السر مطلوبة")
        private String password;
    }

    // ─── Response: JWT Token بعد تسجيل الدخول ────────────────────────────────
    @Data
    public static class LoginResponse {
        private String token;
        private String role;
        private String username;

        public LoginResponse(String token, String role, String username) {
            this.token = token;
            this.role = role;
            this.username = username;
        }
    }

    // ─── Request: التحقق من رابط الشركة وإصدار Token مؤقت ───────────────────
    @Data
    public static class CompanyTokenRequest {
        @NotBlank
        private String token;
    }

    // ─── Response: JWT مؤقت للشركة ────────────────────────────────────────────
    @Data
    public static class CompanyTokenResponse {
        private String accessToken;
        private String companyName;
        private boolean valid;

        public CompanyTokenResponse(String accessToken, String companyName, boolean valid) {
            this.accessToken = accessToken;
            this.companyName = companyName;
            this.valid = valid;
        }
    }
}