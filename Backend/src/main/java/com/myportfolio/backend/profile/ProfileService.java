package com.myportfolio.backend.profile;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepo profileRepo;

    // ─── جلب البيانات العامة (للزوار) ────────────────────────────────────────
    public ProfileDto.PublicResponse getPublicProfile() {
        Profile profile = getOrCreateProfile();
        ProfileDto.PublicResponse response = new ProfileDto.PublicResponse();
        response.setFullName(profile.getFullName());
        response.setTitle(profile.getTitle());
        response.setBio(profile.getBio());
        response.setPhotoUrl(profile.getPhotoUrl());
        response.setEmail(profile.getEmail());
        response.setLocation(profile.getLocation());
        return response;
    }

    // ─── جلب البيانات الكاملة (للشركات بعد التحقق من الرابط) ────────────────
    public ProfileDto.CompanyResponse getCompanyProfile() {
        Profile profile = getOrCreateProfile();
        ProfileDto.CompanyResponse response = new ProfileDto.CompanyResponse();
        response.setFullName(profile.getFullName());
        response.setTitle(profile.getTitle());
        response.setBio(profile.getBio());
        response.setPhotoUrl(profile.getPhotoUrl());
        response.setEmail(profile.getEmail());
        response.setPhone(profile.getPhone());
        response.setLocation(profile.getLocation());
        response.setCvUrl(profile.getCvUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setProjects(profile.getProjects());
        response.setCertificates(profile.getCertificates());
        response.setSkills(profile.getSkills());
        return response;
    }

    // ─── تحديث البروفايل (للـ Admin) ──────────────────────────────────────────
    public ProfileDto.CompanyResponse updateProfile(ProfileDto.UpdateRequest request) {
        Profile profile = getOrCreateProfile();
        profile.setFullName(request.getFullName());
        profile.setTitle(request.getTitle());
        profile.setBio(request.getBio());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setProjects(request.getProjects());
        profile.setCertificates(request.getCertificates());
        profile.setSkills(request.getSkills());
        profileRepo.save(profile);
        return getCompanyProfile();
    }

    // ─── رفع الصورة الشخصية ───────────────────────────────────────────────────
    public String uploadPhoto(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/");
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        String photoUrl = "/uploads/" + filename;
        Profile profile = getOrCreateProfile();
        profile.setPhotoUrl(photoUrl);
        profileRepo.save(profile);
        return photoUrl;
    }

    // ─── Helper ───────────────────────────────────────────────────────────────
    private Profile getOrCreateProfile() {
        List<Profile> profiles = profileRepo.findAll();
        if (profiles.isEmpty()) {
            return profileRepo.save(Profile.builder().build());
        }
        return profiles.get(0);
    }
}