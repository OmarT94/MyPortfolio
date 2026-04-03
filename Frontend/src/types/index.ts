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
    isActive: boolean
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