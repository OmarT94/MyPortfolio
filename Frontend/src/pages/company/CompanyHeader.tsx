import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import type { CompanyProfile } from '../../types'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

interface CompanyHeaderProps {
  profile: CompanyProfile
}

export const CompanyHeader = ({ profile }: CompanyHeaderProps) => (
  <div className="bg-slate-900 border-b border-slate-800">
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

        {/* Photo */}
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.fullName}
            className="w-28 h-28 rounded-2xl object-cover ring-2 ring-primary-500/30 shadow-xl shrink-0"
          />
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center shrink-0">
            <span className="text-3xl font-bold text-white">
              {profile.fullName?.charAt(0)}
            </span>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-center md:text-right space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{profile.fullName}</h1>
            <p className="text-primary-400 font-medium mt-1">{profile.title}</p>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{profile.bio}</p>

          {/* Contact row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary-400" /> {profile.location}
              </span>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                <Mail size={14} className="text-primary-400" /> {profile.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                <Phone size={14} className="text-primary-400" /> {profile.phone}
              </a>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-3 justify-center md:justify-start pt-1">
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink size={14} /> تحميل السيرة الذاتية
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <GitHubIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)
