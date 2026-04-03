package com.myportfolio.backend.auth;

import com.myportfolio.backend.company.Company;
import com.myportfolio.backend.company.CompanyRepo;
import com.myportfolio.backend.notification.NotificationEvent;
import com.myportfolio.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final CompanyRepo companyRepo;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    public AuthService(JwtService jwtService, CompanyRepo companyRepo, ApplicationEventPublisher eventPublisher) {
        this.jwtService = jwtService;
        this.companyRepo = companyRepo;
        this.eventPublisher = eventPublisher;
    }

    public AuthDto.LoginResponse adminLogin(AuthDto.LoginRequest request) {
        if (!request.getUsername().equals(adminUsername)
                || !request.getPassword().equals(adminPassword)) {
            throw new RuntimeException("بيانات الدخول غير صحيحة");
        }
        String token = jwtService.generateAdminToken(adminUsername);
        return new AuthDto.LoginResponse(token, "ADMIN", adminUsername);
    }

    public AuthDto.CompanyTokenResponse companyLogin(AuthDto.CompanyTokenRequest request) {
        Company company = companyRepo.findByToken(request.getToken()).orElse(null);

        if (company == null || !company.isActive()
                || company.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new AuthDto.CompanyTokenResponse(null, null, false, null);
        }

        String jwt = jwtService.generateCompanyToken(company.getId(), company.getName());


        company.setVisitCount(company.getVisitCount() + 1);
        companyRepo.save(company);
        eventPublisher.publishEvent(
                new NotificationEvent(this,
                        "🏢 " + company.getName() + " دخلت للتو إلى ملفك الشخصي!")
        );

        return new AuthDto.CompanyTokenResponse(jwt, company.getName(), true, company.getLanguage());
    }
}