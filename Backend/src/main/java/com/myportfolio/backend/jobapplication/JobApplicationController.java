package com.myportfolio.backend.jobapplication;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    // ─── GET: alle Bewerbungen ────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<JobApplicationDto.Response>> getAll() {
        return ResponseEntity.ok(jobApplicationService.getAll());
    }

    // ─── GET: PDF direkt im Browser öffnen ───────────────────────────────────
    @GetMapping("/preview-pdf")
    public ResponseEntity<byte[]> previewPdf() throws IOException {
        byte[] pdfBytes = jobApplicationService.generatePdfBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=bewerbungen.pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    // ─── POST: neue Bewerbung erstellen ───────────────────────────────────────
    @PostMapping
    public ResponseEntity<JobApplicationDto.Response> create(
            @Valid @RequestBody JobApplicationDto.Request request) {
        return ResponseEntity.ok(jobApplicationService.create(request));
    }

    // ─── PUT: Bewerbung bearbeiten ────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto.Response> update(
            @PathVariable String id,
            @Valid @RequestBody JobApplicationDto.Request request) {
        return ResponseEntity.ok(jobApplicationService.update(id, request));
    }

    // ─── PATCH: nur Status ändern ─────────────────────────────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationDto.Response> updateStatus(
            @PathVariable String id,
            @RequestBody JobApplicationDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateStatus(id, request));
    }

    // ─── DELETE: Bewerbung löschen ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        jobApplicationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ─── POST: PDF zu Cloudinary hochladen ───────────────────────────────────
    @PostMapping("/export-pdf")
    public ResponseEntity<JobApplicationDto.PdfResponse> exportToPdf() throws IOException {
        return ResponseEntity.ok(jobApplicationService.exportToPdf());
    }
}