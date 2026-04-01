package com.myportfolio.backend.auth;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthDto.LoginResponse> adminLogin(
            @Valid @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    @PostMapping("/company/login")
    public ResponseEntity<AuthDto.CompanyTokenResponse> companyLogin(
            @Valid @RequestBody AuthDto.CompanyTokenRequest request) {
        return ResponseEntity.ok(authService.companyLogin(request));
    }
}