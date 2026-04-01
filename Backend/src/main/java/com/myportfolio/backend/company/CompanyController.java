package com.myportfolio.backend.company;


import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/admin/companies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompanyDto.AdminResponse> createCompany(
            @Valid @RequestBody CompanyDto.CreateRequest request) {
        return ResponseEntity.ok(companyService.createCompany(request));
    }

    @GetMapping("/admin/companies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompanyDto.AdminResponse>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PatchMapping("/admin/companies/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompanyDto.AdminResponse> updateStatus(
            @PathVariable String id,
            @RequestBody CompanyDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(companyService.updateStatus(id, request));
    }

    @DeleteMapping("/admin/companies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCompany(@PathVariable String id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/validate/{token}")
    public ResponseEntity<CompanyDto.TokenValidResponse> validateToken(
            @PathVariable String token) {
        return ResponseEntity.ok(companyService.validateToken(token));
    }
}