package com.myportfolio.backend.jobapplication;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/job-applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    // ─── GET: جلب كل الطلبات ─────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<JobApplicationDto.Response>> getAll() {
        return ResponseEntity.ok(jobApplicationService.getAll());
    }

    // ─── POST: إنشاء طلب جديد ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<JobApplicationDto.Response> create(
            @Valid @RequestBody JobApplicationDto.Request request) {
        return ResponseEntity.ok(jobApplicationService.create(request));
    }

    // ─── PUT: تعديل طلب كامل ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto.Response> update(
            @PathVariable String id,
            @Valid @RequestBody JobApplicationDto.Request request) {
        return ResponseEntity.ok(jobApplicationService.update(id, request));
    }

    // ─── PATCH: تحديث الحالة فقط (Drag & Drop مثلاً) ─────────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationDto.Response> updateStatus(
            @PathVariable String id,
            @RequestBody JobApplicationDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateStatus(id, request));
    }

    // ─── DELETE: حذف طلب ─────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        jobApplicationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ─── POST: توليد PDF + رفعه لـ Cloudinary ────────────────────────────────
    @PostMapping("/export-pdf")
    public ResponseEntity<JobApplicationDto.PdfResponse> exportToPdf() throws IOException {
        return ResponseEntity.ok(jobApplicationService.exportToPdf());
    }
}
