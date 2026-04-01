package com.myportfolio.backend.visit;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepo extends MongoRepository<Visit, String> {

    List<Visit> findByCompanyIdOrderByTimestampDesc(String companyId);

    List<Visit> findAllByOrderByTimestampDesc();

    Optional<Visit> findTopByCompanyIdOrderByTimestampDesc(String companyId);

    long countByCompanyId(String companyId);
}