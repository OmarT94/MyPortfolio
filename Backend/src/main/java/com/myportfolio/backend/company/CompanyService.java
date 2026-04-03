package com.myportfolio.backend.company;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepo companyRepo;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${cors.allowed-origins}")
    private String frontendUrl;

    public CompanyService(CompanyRepo companyRepo,
                          ApplicationEventPublisher eventPublisher) {
        this.companyRepo = companyRepo;
        this.eventPublisher = eventPublisher;
    }

    public CompanyDto.AdminResponse createCompany(CompanyDto.CreateRequest request) {
        String token = generateUniqueToken();
        int days = request.getExpiresInDays() > 0 ? request.getExpiresInDays() : 30;

        Company company = Company.builder()
                .name(request.getName())
                .token(token)
                .isActive(true)
                .expiresAt(LocalDateTime.now().plusDays(days))
                .createdAt(LocalDateTime.now())
                .visitCount(0)
                .build();

        return mapToAdminResponse(companyRepo.save(company));
    }

    public List<CompanyDto.AdminResponse> getAllCompanies() {
        return companyRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToAdminResponse).collect(Collectors.toList());
    }

    public CompanyDto.AdminResponse updateStatus(String id,
                                                 CompanyDto.UpdateStatusRequest request) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("الشركة غير موجودة"));
        company.setActive(request.isActive());
        return mapToAdminResponse(companyRepo.save(company));
    }

    public void deleteCompany(String id) {
        companyRepo.deleteById(id);
    }

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
        return response;
    }
}