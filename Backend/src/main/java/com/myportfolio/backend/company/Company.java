package com.myportfolio.backend.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "companies")
public class Company {

    @Id
    private String id;

    private String name;           // اسم الشركة

    @Indexed(unique = true)
    private String token;          // الرابط السري الفريد

    private boolean isActive;      // هل الرابط مفعّل؟

    private LocalDateTime expiresAt;   // تاريخ انتهاء الرابط

    private LocalDateTime createdAt;

    private int visitCount;        // عدد الزيارات الكلي
}