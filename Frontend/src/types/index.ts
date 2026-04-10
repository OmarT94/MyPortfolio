// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
    role: 'ADMIN'
    username: string
}

export interface CompanyTokenRequest {
    token: string
}

export interface CompanyTokenResponse {
    accessToken: string
    companyName: string
    valid: boolean
    language?: string
}

// ─── Company ──────────────────────────────────────────────────────────────────

export interface Company {
    id: string
    name: string
    token: string
    magicLink: string
    active: boolean
    expiresAt: string
    createdAt: string
    visitCount: number
    language: string
}

export interface CreateCompanyRequest {
    name: string
    expiresInDays: number
}

export interface UpdateStatusRequest {
    active: boolean
}

export interface TokenValidResponse {
    valid: boolean
    companyName?: string
    companyId?: string
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Project {
    id: string
    title: string
    description: string
    githubLink?: string
    liveLink?: string
    technologies: string[]
    imageUrl?: string
}

export interface Certificate {
    id: string
    title: string
    issuer: string
    date: string
    imageUrl?: string
    credentialUrl?: string
}

export interface Skill {
    name: string
    level: 'Beginner' | 'Intermediate' | 'Advanced'
    category: string
}

export interface PublicProfile {
    fullName: string
    title: string
    bio: string
    photoUrl?: string
    email: string
    location: string

    // ─── AR ───────────────────────────────────────────────────────────────
    fullName_ar?: string
    title_ar?: string
    bio_ar?: string
    location_ar?: string

    // ─── EN ───────────────────────────────────────────────────────────────
    fullName_en?: string
    title_en?: string
    bio_en?: string
    location_en?: string

    // ─── DE ───────────────────────────────────────────────────────────────
    fullName_de?: string
    title_de?: string
    bio_de?: string
    location_de?: string
}

export interface CompanyProfile extends PublicProfile {
    phone?: string
    cvUrl?: string
    githubUrl?: string
    linkedinUrl?: string
    projects: Project[]
    certificates: Certificate[]
    skills: Skill[]
}

export interface UpdateProfileRequest {
    fullName: string
    title: string
    bio: string
    email: string
    phone?: string
    location: string
    githubUrl?: string
    linkedinUrl?: string
    projects: Project[]
    certificates: Certificate[]
    skills: Skill[]

    // ─── AR ───────────────────────────────────────────────────────────────
    fullName_ar?: string
    title_ar?: string
    bio_ar?: string
    location_ar?: string

    // ─── EN ───────────────────────────────────────────────────────────────
    fullName_en?: string
    title_en?: string
    bio_en?: string
    location_en?: string

    // ─── DE ───────────────────────────────────────────────────────────────
    fullName_de?: string
    title_de?: string
    bio_de?: string
    location_de?: string
}

// ─── Visit ────────────────────────────────────────────────────────────────────

export interface Visit {
    id: string
    companyId: string
    companyName: string
    timestamp: string
    pagesViewed: string[]
    durationSeconds: number
}

export interface LogVisitRequest {
    companyToken: string
    pagesViewed: string[]
    durationSeconds: number
}

export interface CompanyStats {
    companyId: string
    companyName: string
    totalVisits: number
    lastVisit?: string
    mostViewedPages: string[]
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
    id: string
    message: string
    read: boolean
    createdAt: string
}

export interface UnreadCountResponse {
    count: number
}

// ─── App State ────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'COMPANY' | 'PUBLIC'

export interface AuthState {
    token: string | null
    role: UserRole
    companyName?: string
}

// ─── JobApplication ───────────────────────────────────────────────────────────

export type ApplicationStatus =
    | 'AUSSTEHEND'
    | 'IN_BEARBEITUNG'
    | 'VORSTELLUNGSGESPRAECH'
    | 'ANGENOMMEN'
    | 'ABGELEHNT'

export interface JobApplication {
    id: string
    companyName: string
    jobTitle: string
    contactPerson?: string
    applicationDate: string
    status: ApplicationStatus
    statusLabel: string
    notes?: string
    createdAt: string
}

export interface CreateJobApplicationRequest {
    companyName: string
    jobTitle: string
    contactPerson?: string
    applicationDate: string
    status: ApplicationStatus
    notes?: string
}

export interface UpdateJobStatusRequest {
    status: ApplicationStatus
}

export interface PdfResponse {
    pdfUrl: string
    message: string
}

export const STATUS_CONFIG: Record<
    ApplicationStatus,
    { label: string; color: string; bg: string }
> = {
    AUSSTEHEND: {
        label: '⏳ Ausstehend',
        color: 'text-amber-400',
        bg:    'bg-amber-500/10 border-amber-500/20',
    },
    IN_BEARBEITUNG: {
        label: '🔄 In Bearbeitung',
        color: 'text-blue-400',
        bg:    'bg-blue-500/10 border-blue-500/20',
    },
    VORSTELLUNGSGESPRAECH: {
        label: '📞 Vorstellungsgespräch',
        color: 'text-purple-400',
        bg:    'bg-purple-500/10 border-purple-500/20',
    },
    ANGENOMMEN: {
        label: '✅ Angenommen',
        color: 'text-emerald-400',
        bg:    'bg-emerald-500/10 border-emerald-500/20',
    },
    ABGELEHNT: {
        label: '❌ Abgelehnt',
        color: 'text-red-400',
        bg:    'bg-red-500/10 border-red-500/20',
    },
}