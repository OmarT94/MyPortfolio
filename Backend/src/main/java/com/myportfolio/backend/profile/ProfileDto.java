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

        // ─── AR ───────────────────────────────────────────────────────────────────
        private String fullName_ar;
        private String title_ar;
        private String bio_ar;
        private String bio_short_ar;
        private String location_ar;

        // ─── EN ───────────────────────────────────────────────────────────────────
        private String fullName_en;
        private String title_en;
        private String bio_en;
        private String bio_short_en;
        private String location_en;

        // ─── DE ───────────────────────────────────────────────────────────────────
        private String fullName_de;
        private String title_de;
        private String bio_de;
        private String bio_short_de;
        private String location_de;
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

        // ─── AR ───────────────────────────────────────────────────────────────────
        private String fullName_ar;
        private String title_ar;
        private String bio_ar;
        private String location_ar;

        // ─── EN ───────────────────────────────────────────────────────────────────
        private String fullName_en;
        private String title_en;
        private String bio_en;
        private String location_en;

        // ─── DE ───────────────────────────────────────────────────────────────────
        private String fullName_de;
        private String title_de;
        private String bio_de;
        private String location_de;

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

        // ─── AR ───────────────────────────────────────────────────────────────────
        private String fullName_ar;
        private String title_ar;
        private String bio_ar;
        private String bio_short_ar;
        private String location_ar;

        // ─── EN ───────────────────────────────────────────────────────────────────
        private String fullName_en;
        private String title_en;
        private String bio_en;
        private String bio_short_en;
        private String location_en;

        // ─── DE ───────────────────────────────────────────────────────────────────
        private String fullName_de;
        private String title_de;
        private String bio_de;
        private String bio_short_de;
        private String location_de;

        private String githubUrl;
        private String linkedinUrl;
        private List<Profile.Project> projects;
        private List<Profile.Certificate> certificates;
        private List<Profile.Skill> skills;
    }
}