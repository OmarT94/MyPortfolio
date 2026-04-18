package com.myportfolio.backend.company;

import com.myportfolio.backend.jobapplication.JobApplication;
import com.myportfolio.backend.jobapplication.JobApplicationRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepo companyRepo;
    private final ApplicationEventPublisher eventPublisher;
    private final JobApplicationRepo jobApplicationRepo;

    private String frontendUrl = "https://www.omartamr.com";

    public CompanyService(CompanyRepo companyRepo,
                          ApplicationEventPublisher eventPublisher,
                          JobApplicationRepo jobApplicationRepo) {
        this.companyRepo = companyRepo;
        this.eventPublisher = eventPublisher;
        this.jobApplicationRepo = jobApplicationRepo;
    }

    // ─── Firma + automatisch Bewerbung erstellen ──────────────────────────────
    public CompanyDto.AdminResponse createCompany(CompanyDto.CreateRequest request) {
        String token = generateUniqueToken();
        int days = request.getExpiresInDays() > 0 ? request.getExpiresInDays() : 30;

        Company company = Company.builder()
                .name(request.getName())
                .token(token)
                .isActive(true)
                .language(request.getLanguage() != null ? request.getLanguage() : "en")
                .jobTitle(request.getJobTitle())
                .expiresAt(LocalDateTime.now().plusDays(days))
                .createdAt(LocalDateTime.now())
                .visitCount(0)
                .build();

        Company saved = companyRepo.save(company);

        // Automatische Bewerbung erstellen wenn Stelle angegeben
        if (request.getJobTitle() != null && !request.getJobTitle().isBlank()) {
            createAutoApplication(request.getName(), request.getJobTitle());
        }

        return mapToAdminResponse(saved);
    }

    // ─── Bewerbung automatisch anlegen ────────────────────────────────────────
    private void createAutoApplication(String companyName, String jobTitle) {
        boolean exists = jobApplicationRepo
                .existsByCompanyNameIgnoreCaseAndJobTitleIgnoreCase(companyName, jobTitle);

        if (exists) {
            // Option C: Warnung — aber trotzdem erstellen
            System.out.println("⚠️ Bewerbung für " + companyName + " existiert bereits — wird trotzdem erstellt");
        }

        JobApplication application = JobApplication.builder()
                .companyName(companyName)
                .jobTitle(jobTitle)
                .applicationDate(LocalDate.now())
                .status(JobApplication.Status.IN_BEARBEITUNG)
                .notes("Automatisch erstellt beim Link-Erstellen")
                .createdAt(LocalDateTime.now())
                .build();

        jobApplicationRepo.save(application);
    }

    // ─── Alle Firmen holen ────────────────────────────────────────────────────
    public List<CompanyDto.AdminResponse> getAllCompanies() {
        return companyRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToAdminResponse).collect(Collectors.toList());
    }

    // ─── Status ändern ────────────────────────────────────────────────────────
    public CompanyDto.AdminResponse updateStatus(String id,
                                                 CompanyDto.UpdateStatusRequest request) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("الشركة غير موجودة"));
        company.setActive(request.isActive());
        return mapToAdminResponse(companyRepo.save(company));
    }

    // ─── Firma löschen ────────────────────────────────────────────────────────
    public void deleteCompany(String id) {
        companyRepo.deleteById(id);
    }

    // ─── Token validieren ─────────────────────────────────────────────────────
    public CompanyDto.TokenValidResponse validateToken(String token) {
        CompanyDto.TokenValidResponse response = new CompanyDto.TokenValidResponse();

        companyRepo.findByToken(token).ifPresentOrElse(company -> {
            boolean isValid = company.isActive()
                    && company.getExpiresAt().isAfter(LocalDateTime.now());
            response.setValid(isValid);

            if (isValid) {
                response.setCompanyName(company.getName());
                response.setCompanyId(company.getId());
                company.setVisitCount(company.getVisitCount() + 1);
                companyRepo.save(company);
            }
        }, () -> response.setValid(false));

        return response;
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        } while (companyRepo.existsByToken(token));
        return token;
    }

    private CompanyDto.AdminResponse mapToAdminResponse(Company company) {
        CompanyDto.AdminResponse response = new CompanyDto.AdminResponse();
        response.setId(company.getId());
        response.setName(company.getName());
        response.setToken(company.getToken());
        response.setMagicLink(frontendUrl + "/view/" + company.getToken());
        response.setActive(company.isActive());
        response.setExpiresAt(company.getExpiresAt());
        response.setCreatedAt(company.getCreatedAt());
        response.setVisitCount(company.getVisitCount());
        response.setLanguage(company.getLanguage());
        response.setJobTitle(company.getJobTitle());
        return response;
    }
}