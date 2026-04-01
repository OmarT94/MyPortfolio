package com.myportfolio.backend.visit;

import com.myportfolio.backend.company.Company;
import com.myportfolio.backend.company.CompanyRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitService {

    private final VisitRepo visitRepo;
    private final CompanyRepo companyRepo;

    public VisitService(VisitRepo visitRepo, CompanyRepo companyRepo) {
        this.visitRepo = visitRepo;
        this.companyRepo = companyRepo;
    }

    public VisitDto.VisitResponse logVisit(VisitDto.LogRequest request) {
        Company company = companyRepo.findByToken(request.getCompanyToken())
                .orElseThrow(() -> new RuntimeException("رابط غير صالح"));
        Visit visit = Visit.builder()
                .companyId(company.getId())
                .companyName(company.getName())
                .timestamp(LocalDateTime.now())
                .pagesViewed(request.getPagesViewed())
                .durationSeconds(request.getDurationSeconds())
                .build();
        return mapToResponse(visitRepo.save(visit));
    }

    public List<VisitDto.VisitResponse> getAllVisits() {
        return visitRepo.findAllByOrderByTimestampDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<VisitDto.VisitResponse> getVisitsByCompany(String companyId) {
        return visitRepo.findByCompanyIdOrderByTimestampDesc(companyId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<VisitDto.CompanyStats> getCompanyStats() {
        return companyRepo.findAllByOrderByCreatedAtDesc().stream().map(company -> {
            List<Visit> visits = visitRepo.findByCompanyIdOrderByTimestampDesc(company.getId());
            VisitDto.CompanyStats stats = new VisitDto.CompanyStats();
            stats.setCompanyId(company.getId());
            stats.setCompanyName(company.getName());
            stats.setTotalVisits(visits.size());
            if (!visits.isEmpty()) {
                stats.setLastVisit(visits.get(0).getTimestamp());
                List<String> allPages = visits.stream()
                        .flatMap(v -> v.getPagesViewed().stream())
                        .distinct().collect(Collectors.toList());
                stats.setMostViewedPages(allPages);
            }
            return stats;
        }).collect(Collectors.toList());
    }

    private VisitDto.VisitResponse mapToResponse(Visit visit) {
        VisitDto.VisitResponse response = new VisitDto.VisitResponse();
        response.setId(visit.getId());
        response.setCompanyId(visit.getCompanyId());
        response.setCompanyName(visit.getCompanyName());
        response.setTimestamp(visit.getTimestamp());
        response.setPagesViewed(visit.getPagesViewed());
        response.setDurationSeconds(visit.getDurationSeconds());
        return response;
    }
}