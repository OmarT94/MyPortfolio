package com.myportfolio.backend.jobapplication;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
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
    private final Cloudinary cloudinary;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    // ─── Labels ohne Emojis (PDF-kompatibel) ─────────────────────────────────
    private static final Map<JobApplication.Status, String> STATUS_LABELS = Map.of(
            JobApplication.Status.AUSSTEHEND,            "Ausstehend",
            JobApplication.Status.IN_BEARBEITUNG,        "In Bearbeitung",
            JobApplication.Status.VORSTELLUNGSGESPRAECH, "Vorstellungsgespraech",
            JobApplication.Status.ANGENOMMEN,            "Angenommen",
            JobApplication.Status.ABGELEHNT,             "Abgelehnt"
    );

    // ─── Farben pro Status ────────────────────────────────────────────────────
    private static final Map<JobApplication.Status, Color> STATUS_COLORS = Map.of(
            JobApplication.Status.AUSSTEHEND,            new Color(245, 158, 11),
            JobApplication.Status.IN_BEARBEITUNG,        new Color(59, 130, 246),
            JobApplication.Status.VORSTELLUNGSGESPRAECH, new Color(139, 92, 246),
            JobApplication.Status.ANGENOMMEN,            new Color(16, 185, 129),
            JobApplication.Status.ABGELEHNT,             new Color(239, 68, 68)
    );

    // ─── Create ───────────────────────────────────────────────────────────────
    public JobApplicationDto.Response create(JobApplicationDto.Request request) {
        boolean exists = jobApplicationRepo
                .existsByCompanyNameIgnoreCaseAndJobTitleIgnoreCase(
                        request.getCompanyName(), request.getJobTitle());

        if (exists) {
            throw new RuntimeException(
                    "Sie haben sich bereits bei " + request.getCompanyName() +
                            " fuer die Stelle '" + request.getJobTitle() + "' beworben!"
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

    // ─── Get All ──────────────────────────────────────────────────────────────
    public List<JobApplicationDto.Response> getAll() {
        return jobApplicationRepo.findAllByOrderByApplicationDateDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ─── Update ───────────────────────────────────────────────────────────────
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

    // ─── Update Status ────────────────────────────────────────────────────────
    public JobApplicationDto.Response updateStatus(String id,
                                                   JobApplicationDto.UpdateStatusRequest request) {
        JobApplication app = jobApplicationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bewerbung nicht gefunden"));
        app.setStatus(request.getStatus());
        return mapToResponse(jobApplicationRepo.save(app));
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    public void delete(String id) {
        jobApplicationRepo.deleteById(id);
    }

    // ─── Public: für Controller direkt streamen ───────────────────────────────
    public byte[] generatePdfBytes() throws IOException {
        List<JobApplication> applications =
                jobApplicationRepo.findAllByOrderByApplicationDateDesc();
        return buildPdf(applications);
    }

    // ─── Export PDF → Cloudinary ──────────────────────────────────────────────
    public JobApplicationDto.PdfResponse exportToPdf() throws IOException {
        byte[] pdfBytes = generatePdfBytes();

        Map uploadResult = cloudinary.uploader().upload(
                pdfBytes,
                ObjectUtils.asMap(
                        "folder",        "portfolio/job-applications",
                        "resource_type", "raw",
                        "format",        "pdf",
                        "access_mode",   "public",
                        "public_id",     "bewerbungen_" + System.currentTimeMillis()
                )
        );

        String pdfUrl = (String) uploadResult.get("secure_url");
        return new JobApplicationDto.PdfResponse(pdfUrl, "PDF erfolgreich exportiert!");
    }

    // ─── Echtes PDF mit OpenPDF ───────────────────────────────────────────────
    private byte[] buildPdf(List<JobApplication> applications) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 50, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont  = new Font(Font.HELVETICA, 20, Font.BOLD,   new Color(2, 132, 199));
            Font metaFont   = new Font(Font.HELVETICA,  9, Font.NORMAL, new Color(100, 116, 139));
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD,   Color.WHITE);
            Font normalFont = new Font(Font.HELVETICA,  9, Font.NORMAL, new Color(30, 41, 59));
            Font boldFont   = new Font(Font.HELVETICA,  9, Font.BOLD,   new Color(30, 41, 59));

            // Titel
            Paragraph title = new Paragraph("Bewerbungsübersicht für Omar Tamr", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            title.setSpacingAfter(6);
            document.add(title);

            // Meta
            Paragraph meta = new Paragraph(
                    "Erstellt am: " + LocalDate.now().format(DATE_FMT) +
                            "    Gesamt: " + applications.size() + " Bewerbungen",
                    metaFont
            );
            meta.setSpacingAfter(14);
            document.add(meta);

            // Tabelle
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{ 3, 14, 18, 14, 10, 16, 25 });
            table.setSpacingBefore(8);

            // Header
            Color headerBg = new Color(2, 132, 199);
            for (String h : new String[]{"#", "Firma", "Stelle", "Ansprechpartner", "Datum", "Status", "Notizen"}) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setPadding(9);
                cell.setBorder(Rectangle.NO_BORDER);
                table.addCell(cell);
            }

            // Daten
            boolean alt = false;
            int idx = 1;
            for (JobApplication app : applications) {
                Color rowBg     = alt ? new Color(241, 245, 249) : Color.WHITE;
                Color statusClr = STATUS_COLORS.getOrDefault(app.getStatus(), Color.GRAY);
                String statusLbl = STATUS_LABELS.getOrDefault(app.getStatus(), "—");
                String dateStr  = app.getApplicationDate() != null
                        ? app.getApplicationDate().format(DATE_FMT) : "—";

                Object[][] cells = {
                        { String.valueOf(idx++),  normalFont },
                        { app.getCompanyName(),   boldFont   },
                        { app.getJobTitle(),      normalFont },
                        { app.getContactPerson() != null ? app.getContactPerson() : "—", normalFont },
                        { dateStr,                normalFont },
                        { statusLbl,              new Font(Font.HELVETICA, 9, Font.BOLD, statusClr) },
                        { app.getNotes() != null ? app.getNotes() : "—", metaFont }
                };

                for (Object[] cellData : cells) {
                    PdfPCell cell = new PdfPCell(new Phrase((String) cellData[0], (Font) cellData[1]));
                    cell.setBackgroundColor(rowBg);
                    cell.setPadding(7);
                    cell.setBorderColor(new Color(226, 232, 240));
                    cell.setBorderWidth(0.5f);
                    table.addCell(cell);
                }
                alt = !alt;
            }

            document.add(table);

            // Footer
            // ─── Footer mit Statistiken ───────────────────────────────────────────────
            long ausstehend    = applications.stream().filter(a -> a.getStatus() == JobApplication.Status.AUSSTEHEND).count();
            long inBearbeitung = applications.stream().filter(a -> a.getStatus() == JobApplication.Status.IN_BEARBEITUNG).count();
            long gespraech     = applications.stream().filter(a -> a.getStatus() == JobApplication.Status.VORSTELLUNGSGESPRAECH).count();
            long angenommen    = applications.stream().filter(a -> a.getStatus() == JobApplication.Status.ANGENOMMEN).count();
            long abgelehnt     = applications.stream().filter(a -> a.getStatus() == JobApplication.Status.ABGELEHNT).count();

            Paragraph footer = new Paragraph(
                    "Zusammenfassung:   " +
                            "Ausstehend: " + ausstehend + "   |   " +
                            "In Bearbeitung: " + inBearbeitung + "   |   " +
                            "Vorstellungsgespräch: " + gespraech + "   |   " +
                            "Angenommen: " + angenommen + "   |   " +
                            "Abgelehnt: " + abgelehnt,
                    metaFont
            );
            footer.setSpacingBefore(12);
            document.add(footer);

        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────
    private JobApplicationDto.Response mapToResponse(JobApplication app) {
        JobApplicationDto.Response r = new JobApplicationDto.Response();
        r.setId(app.getId());
        r.setCompanyName(app.getCompanyName());
        r.setJobTitle(app.getJobTitle());
        r.setContactPerson(app.getContactPerson());
        r.setApplicationDate(app.getApplicationDate());
        r.setStatus(app.getStatus());
        r.setStatusLabel(STATUS_LABELS.getOrDefault(app.getStatus(), "—"));
        r.setNotes(app.getNotes());
        r.setCreatedAt(app.getCreatedAt());
        return r;
    }
}