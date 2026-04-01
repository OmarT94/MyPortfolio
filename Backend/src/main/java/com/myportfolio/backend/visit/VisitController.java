package com.myportfolio.backend.visit;

import com.myportfolio.backend.visit.VisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping("/public/visits/log")
    public ResponseEntity<VisitDto.VisitResponse> logVisit(
            @RequestBody VisitDto.LogRequest request) {
        return ResponseEntity.ok(visitService.logVisit(request));
    }

    @GetMapping("/admin/visits")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto.VisitResponse>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/admin/visits/company/{companyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto.VisitResponse>> getVisitsByCompany(
            @PathVariable String companyId) {
        return ResponseEntity.ok(visitService.getVisitsByCompany(companyId));
    }

    @GetMapping("/admin/visits/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto.CompanyStats>> getCompanyStats() {
        return ResponseEntity.ok(visitService.getCompanyStats());
    }
}