package com.myportfolio.backend.jobapplication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_applications")
public class JobApplication {

    @Id
    private String id;

    private String companyName;         // Firmenname
    private String jobTitle;            // Art der Stelle
    private String contactPerson;       // Ansprechpartner
    private LocalDate applicationDate;  // Datum der Bewerbung
    private Status status;              // Rückmeldung
    private String notes;               // Notizen (optional)
    private LocalDateTime createdAt;

    public enum Status {
        AUSSTEHEND,              // ⏳ بانتظار
        IN_BEARBEITUNG,          // 🔄 قيد المعالجة
        VORSTELLUNGSGESPRAECH,   // 📞 مقابلة
        ANGENOMMEN,              // ✅ مقبول
        ABGELEHNT                // ❌ مرفوض
    }
}
