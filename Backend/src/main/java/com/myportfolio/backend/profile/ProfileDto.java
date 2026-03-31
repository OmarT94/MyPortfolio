package com.myportfolio.backend.profile;

import lombok.Data;

import java.util.List;

public class ProfileDto {

    // ─── Response: للزوار العاديين (بيانات محدودة) ───────────────────────────
    @Data
    public static class PublicResponse {
        private String fullName;
        private String title;
        private String bio;
        private String photoUrl;
        private String email;
        private String location;
    }

    // ─── Response: للشركات (بيانات كاملة) ────────────────────────────────────
    @Data
    public static class CompanyResponse {
        private String fullName;
        private String title;
        private String bio;
        private String photoUrl;
        private String email;
        private String phone;
        private String location;
        private String cvUrl;
        private String githubUrl;
        private String linkedinUrl;
        private List<Profile.Project> projects;
        private List<Profile.Certificate> certificates;
        private List<Profile.Skill> skills;
    }

    // ─── Request: تحديث البروفايل (للـ Admin) ────────────────────────────────
    @Data
    public static class UpdateRequest {
        private String fullName;
        private String title;
        private String bio;
        private String email;
        private String phone;
        private String location;
        private String githubUrl;
        private String linkedinUrl;
        private List<Profile.Project> projects;
        private List<Profile.Certificate> certificates;
        private List<Profile.Skill> skills;
    }
}