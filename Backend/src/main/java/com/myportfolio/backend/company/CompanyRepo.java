package com.myportfolio.backend.company;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepo extends MongoRepository<Company, String> {

    Optional<Company> findByToken(String token);

    // الشركات النشطة وغير المنتهية الصلاحية
    List<Company> findByIsActiveTrueAndExpiresAtAfter(LocalDateTime now);

    // كل الشركات للـ Admin
    List<Company> findAllByOrderByCreatedAtDesc();

    boolean existsByToken(String token);
}