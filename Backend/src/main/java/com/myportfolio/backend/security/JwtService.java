package com.myportfolio.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // ─── توليد Token للـ Admin ────────────────────────────────────────────────
    public String generateAdminToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ADMIN");
        return buildToken(claims, username, expiration);
    }

    // ─── توليد Token مؤقت للشركة (صالح لساعتين فقط) ─────────────────────────
    public String generateCompanyToken(String companyId, String companyName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "COMPANY");
        claims.put("companyId", companyId);
        claims.put("companyName", companyName);
        return buildToken(claims, companyId, 7_200_000L); // 2 ساعة
    }

    // ─── استخراج اسم المستخدم من الـ Token ───────────────────────────────────
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ─── استخراج الـ Role ─────────────────────────────────────────────────────
    public String extractRole(String token) {
        return (String) extractClaims(token).get("role");
    }

    // ─── استخراج companyId من Token الشركة ───────────────────────────────────
    public String extractCompanyId(String token) {
        return (String) extractClaims(token).get("companyId");
    }

    // ─── التحقق من صلاحية الـ Token ──────────────────────────────────────────
    public boolean isTokenValid(String token) {
        try {
            return !extractClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private String buildToken(Map<String, Object> claims, String subject, long expirationMs) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}