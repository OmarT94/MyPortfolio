package com.myportfolio.backend.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profile")
public class Profile {

    @Id
    private String id;

    // ─── المعلومات العامة (يراها الجميع) ─────────────────────────────────────
    private String fullName;
    private String title;           // مثل: "Full Stack Developer"
    private String bio;             // وصف مختصر
    private String photoUrl;        // مسار الصورة الشخصية
    private String email;
    private String location;

    // ─── المعلومات بثلاث لغات ─────────────────────────────────────────────────
// العربية
    private String fullName_ar;
    private String title_ar;
    private String bio_ar;
    private String location_ar;

    // الإنجليزية
    private String fullName_en;
    private String title_en;
    private String bio_en;
    private String location_en;

    // الألمانية
    private String fullName_de;
    private String title_de;
    private String bio_de;
    private String location_de;

    // ─── المعلومات الخاصة (الشركات فقط بعد الرابط السري) ────────────────────
    private String cvUrl;           // رابط تحميل الـ CV
    private List<Project> projects;
    private List<Certificate> certificates;
    private List<Skill> skills;
    private String githubUrl;
    private String linkedinUrl;
    private String phone;

    // ─── Nested Types ─────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String id;
        private String title;
        private String description;
        private String githubLink;
        private String liveLink;
        private List<String> technologies;
        private String imageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certificate {
        private String id;
        private String title;
        private String issuer;
        private String date;
        private String imageUrl;
        private String credentialUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Skill {
        private String name;
        private String level;       // Beginner, Intermediate, Advanced
        private String category;    // Frontend, Backend, Database, etc.
    }
}