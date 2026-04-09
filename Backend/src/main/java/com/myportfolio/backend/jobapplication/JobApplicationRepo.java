package com.myportfolio.backend.jobapplication;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepo extends MongoRepository<JobApplication, String> {

    // جلب كل الطلبات مرتبة من الأحدث للأقدم
    List<JobApplication> findAllByOrderByApplicationDateDesc();

    // فلترة حسب الحالة
    List<JobApplication> findByStatusOrderByApplicationDateDesc(JobApplication.Status status);

    // التحقق من وجود طلب لنفس الشركة ونفس الوظيفة — لمنع التكرار
    boolean existsByCompanyNameIgnoreCaseAndJobTitleIgnoreCase(
            String companyName, String jobTitle);
}
