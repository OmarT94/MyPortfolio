package com.myportfolio.backend.profile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepo profileRepo;
    private final Cloudinary cloudinary; // ← أضف هذا

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

        // AR
        response.setFullName_ar(profile.getFullName_ar());
        response.setTitle_ar(profile.getTitle_ar());
        response.setBio_ar(profile.getBio_ar());
        response.setLocation_ar(profile.getLocation_ar());

        // EN
        response.setFullName_en(profile.getFullName_en());
        response.setTitle_en(profile.getTitle_en());
        response.setBio_en(profile.getBio_en());
        response.setLocation_en(profile.getLocation_en());

        // DE
        response.setFullName_de(profile.getFullName_de());
        response.setTitle_de(profile.getTitle_de());
        response.setBio_de(profile.getBio_de());
        response.setLocation_de(profile.getLocation_de());

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

        // AR
        response.setFullName_ar(profile.getFullName_ar());
        response.setTitle_ar(profile.getTitle_ar());
        response.setBio_ar(profile.getBio_ar());
        response.setLocation_ar(profile.getLocation_ar());

        // EN
        response.setFullName_en(profile.getFullName_en());
        response.setTitle_en(profile.getTitle_en());
        response.setBio_en(profile.getBio_en());
        response.setLocation_en(profile.getLocation_en());

        // DE
        response.setFullName_de(profile.getFullName_de());
        response.setTitle_de(profile.getTitle_de());
        response.setBio_de(profile.getBio_de());
        response.setLocation_de(profile.getLocation_de());
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

        // AR
        profile.setFullName_ar(request.getFullName_ar());
        profile.setTitle_ar(request.getTitle_ar());
        profile.setBio_ar(request.getBio_ar());
        profile.setLocation_ar(request.getLocation_ar());

        // EN
        profile.setFullName_en(request.getFullName_en());
        profile.setTitle_en(request.getTitle_en());
        profile.setBio_en(request.getBio_en());
        profile.setLocation_en(request.getLocation_en());

        // DE
        profile.setFullName_de(request.getFullName_de());
        profile.setTitle_de(request.getTitle_de());
        profile.setBio_de(request.getBio_de());
        profile.setLocation_de(request.getLocation_de());

        profileRepo.save(profile);
        return getCompanyProfile();
    }

    // ─── رفع الصورة الشخصية → Cloudinary ────────────────────────────────────
    public String uploadPhoto(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "portfolio/photos",
                        "resource_type", "image"
                )
        );
        String photoUrl = (String) uploadResult.get("secure_url");
        Profile profile = getOrCreateProfile();
        profile.setPhotoUrl(photoUrl);
        profileRepo.save(profile);
        return photoUrl;
    }

    // ─── رفع CV → Cloudinary ─────────────────────────────────────────────────
    public String uploadCv(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "portfolio/cv",
                        "resource_type", "raw",
                        "format", "pdf",
                        "type", "upload"
                )
        );
        String cvUrl = (String) uploadResult.get("secure_url");
        Profile profile = getOrCreateProfile();
        profile.setCvUrl(cvUrl);
        profileRepo.save(profile);
        return cvUrl;
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