package com.myportfolio.backend.profile;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ─── Public: للزوار العاديين ──────────────────────────────────────────────
    @GetMapping("/public/profile")
    public ResponseEntity<ProfileDto.PublicResponse> getPublicProfile() {
        return ResponseEntity.ok(profileService.getPublicProfile());
    }

    // ─── Company: للشركات بعد التحقق من الرابط ───────────────────────────────
    // (يُحمى بـ JWT token خاص بالشركة يُنشأ بعد validateToken)
    @GetMapping("/company/profile")
    public ResponseEntity<ProfileDto.CompanyResponse> getCompanyProfile() {
        return ResponseEntity.ok(profileService.getCompanyProfile());
    }

    // ─── Admin Only ───────────────────────────────────────────────────────────
    @PutMapping("/admin/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfileDto.CompanyResponse> updateProfile(
            @RequestBody ProfileDto.UpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }

    @PostMapping("/admin/profile/photo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(profileService.uploadPhoto(file));
    }
}