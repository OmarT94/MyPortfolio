package com.myportfolio.backend.visit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "visits")
public class Visit {

    @Id
    private String id;

    private String companyId;
    private String companyName;

    private LocalDateTime timestamp;

    private List<String> pagesViewed;   // ["projects", "cv", "certificates"]

    private long durationSeconds;       // مدة الجلسة بالثواني
}