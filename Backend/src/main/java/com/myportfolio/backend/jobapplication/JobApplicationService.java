package com.myportfolio.backend.jobapplication;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepo jobApplicationRepo;
    private final Cloudinary cloudinary; // ← نفس الـ Cloudinary من ProfileService

    // ─── Labels الألمانية لكل حالة ───────────────────────────────────────────
    private static final Map<JobApplication.Status, String> STATUS_LABELS = Map.of(
        JobApplication.Status.AUSSTEHEND,            "⏳ Ausstehend",
        JobApplication.Status.IN_BEARBEITUNG,        "🔄 In Bearbeitung",
        JobApplication.Status.VORSTELLUNGSGESPRAECH, "📞 Vorstellungsgespräch",
        JobApplication.Status.ANGENOMMEN,            "✅ Angenommen",
        JobApplication.Status.ABGELEHNT,             "❌ Abgelehnt"
    );

    // ─── إنشاء طلب جديد ──────────────────────────────────────────────────────
    public JobApplicationDto.Response create(JobApplicationDto.Request request) {

        // منع التكرار — نفس الشركة + نفس الوظيفة
        boolean exists = jobApplicationRepo
            .existsByCompanyNameIgnoreCaseAndJobTitleIgnoreCase(
                request.getCompanyName(), request.getJobTitle());

        if (exists) {
            throw new RuntimeException(
                "⚠️ Sie haben sich bereits bei " + request.getCompanyName() +
                " für die Stelle '" + request.getJobTitle() + "' beworben!"
            );
        }

        JobApplication application = JobApplication.builder()
            .companyName(request.getCompanyName())
            .jobTitle(request.getJobTitle())
            .contactPerson(request.getContactPerson())
            .applicationDate(request.getApplicationDate() != null
                ? request.getApplicationDate() : LocalDate.now())
            .status(request.getStatus() != null
                ? request.getStatus() : JobApplication.Status.AUSSTEHEND)
            .notes(request.getNotes())
            .createdAt(LocalDateTime.now())
            .build();

        return mapToResponse(jobApplicationRepo.save(application));
    }

    // ─── جلب كل الطلبات ──────────────────────────────────────────────────────
    public List<JobApplicationDto.Response> getAll() {
        return jobApplicationRepo.findAllByOrderByApplicationDateDesc()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ─── تعديل طلب كامل ──────────────────────────────────────────────────────
    public JobApplicationDto.Response update(String id, JobApplicationDto.Request request) {
        JobApplication app = jobApplicationRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Bewerbung nicht gefunden"));

        app.setCompanyName(request.getCompanyName());
        app.setJobTitle(request.getJobTitle());
        app.setContactPerson(request.getContactPerson());
        app.setApplicationDate(request.getApplicationDate());
        app.setStatus(request.getStatus());
        app.setNotes(request.getNotes());

        return mapToResponse(jobApplicationRepo.save(app));
    }

    // ─── تحديث الحالة فقط ────────────────────────────────────────────────────
    public JobApplicationDto.Response updateStatus(String id,
                                                   JobApplicationDto.UpdateStatusRequest request) {
        JobApplication app = jobApplicationRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Bewerbung nicht gefunden"));

        app.setStatus(request.getStatus());
        return mapToResponse(jobApplicationRepo.save(app));
    }

    // ─── حذف طلب ─────────────────────────────────────────────────────────────
    public void delete(String id) {
        jobApplicationRepo.deleteById(id);
    }

    // ─── توليد PDF + رفعه لـ Cloudinary ──────────────────────────────────────
    public JobApplicationDto.PdfResponse exportToPdf() throws IOException {
        List<JobApplication> applications =
            jobApplicationRepo.findAllByOrderByApplicationDateDesc();

        // توليد محتوى الـ PDF كـ HTML بسيط محوّل لـ bytes
        byte[] pdfBytes = generatePdfBytes(applications);

        // رفع لـ Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
            pdfBytes,
            ObjectUtils.asMap(
                "folder",        "portfolio/job-applications",
                "resource_type", "raw",
                "format",        "pdf",
                "public_id",     "bewerbungen_" + System.currentTimeMillis()
            )
        );

        String pdfUrl = (String) uploadResult.get("secure_url");
        return new JobApplicationDto.PdfResponse(pdfUrl, "PDF erfolgreich exportiert!");
    }

    // ─── توليد PDF بدون مكتبات خارجية (HTML → bytes) ─────────────────────────
    private byte[] generatePdfBytes(List<JobApplication> applications) throws IOException {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head>")
            .append("<meta charset='UTF-8'>")
            .append("<style>")
            .append("body { font-family: Arial, sans-serif; margin: 40px; direction: ltr; }")
            .append("h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px; }")
            .append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }")
            .append("th { background: #0284c7; color: white; padding: 10px; text-align: left; }")
            .append("td { padding: 10px; border-bottom: 1px solid #e2e8f0; }")
            .append("tr:nth-child(even) { background: #f8fafc; }")
            .append(".status-AUSSTEHEND { color: #f59e0b; }")
            .append(".status-IN_BEARBEITUNG { color: #3b82f6; }")
            .append(".status-VORSTELLUNGSGESPRAECH { color: #8b5cf6; }")
            .append(".status-ANGENOMMEN { color: #10b981; font-weight: bold; }")
            .append(".status-ABGELEHNT { color: #ef4444; }")
            .append("</style></head><body>")
            .append("<h1>📋 Bewerbungsübersicht</h1>")
            .append("<p>Erstellt am: ")
            .append(LocalDate.now().format(dateFormatter))
            .append(" | Gesamt: ").append(applications.size()).append(" Bewerbungen</p>")
            .append("<table>")
            .append("<tr>")
            .append("<th>#</th>")
            .append("<th>Firma</th>")
            .append("<th>Stelle</th>")
            .append("<th>Ansprechpartner</th>")
            .append("<th>Datum</th>")
            .append("<th>Status</th>")
            .append("<th>Notizen</th>")
            .append("</tr>");

        int index = 1;
        for (JobApplication app : applications) {
            String statusLabel = STATUS_LABELS.getOrDefault(app.getStatus(), "—");
            String dateStr = app.getApplicationDate() != null
                ? app.getApplicationDate().format(dateFormatter) : "—";

            html.append("<tr>")
                .append("<td>").append(index++).append("</td>")
                .append("<td><strong>").append(escape(app.getCompanyName())).append("</strong></td>")
                .append("<td>").append(escape(app.getJobTitle())).append("</td>")
                .append("<td>").append(escape(app.getContactPerson() != null ? app.getContactPerson() : "—")).append("</td>")
                .append("<td>").append(dateStr).append("</td>")
                .append("<td class='status-").append(app.getStatus()).append("'>")
                    .append(statusLabel).append("</td>")
                .append("<td>").append(escape(app.getNotes() != null ? app.getNotes() : "—")).append("</td>")
                .append("</tr>");
        }

        html.append("</table></body></html>");

        // تحويل HTML لـ bytes (Cloudinary يقبل HTML كـ raw)
        return html.toString().getBytes("UTF-8");
    }

    // ─── Helper: تنظيف النص من HTML special chars ─────────────────────────────
    private String escape(String text) {
        if (text == null) return "—";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;");
    }

    // ─── Helper: تحويل لـ Response ───────────────────────────────────────────
    private JobApplicationDto.Response mapToResponse(JobApplication app) {
        JobApplicationDto.Response response = new JobApplicationDto.Response();
        response.setId(app.getId());
        response.setCompanyName(app.getCompanyName());
        response.setJobTitle(app.getJobTitle());
        response.setContactPerson(app.getContactPerson());
        response.setApplicationDate(app.getApplicationDate());
        response.setStatus(app.getStatus());
        response.setStatusLabel(STATUS_LABELS.getOrDefault(app.getStatus(), "—"));
        response.setNotes(app.getNotes());
        response.setCreatedAt(app.getCreatedAt());
        return response;
    }
}
