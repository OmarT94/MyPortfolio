import { User } from 'lucide-react'
import type { PublicProfile } from '../../types'

interface AboutSectionProps {
  profile: PublicProfile
}

export const AboutSection = ({ profile }: AboutSectionProps) => (
  <section id="about" className="py-24 px-4">
    <div className="max-w-4xl mx-auto">

      {/* Section Title */}
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 bg-primary-500/10 rounded-lg">
          <User size={20} className="text-primary-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100">نبذة عني</h2>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Text */}
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>{profile.bio}</p>
          <div className="pt-4 space-y-2">
            <InfoRow label="الاسم"    value={profile.fullName} />
            <InfoRow label="الموقع"   value={profile.location} />
            <InfoRow label="البريد"   value={profile.email} />
          </div>
        </div>

        {/* Photo */}
        <div className="flex justify-center">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="w-64 h-64 rounded-2xl object-cover shadow-2xl ring-1 ring-slate-700"
            />
          ) : (
            <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center ring-1 ring-slate-700">
              <User size={64} className="text-slate-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
)

const InfoRow = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex gap-3 text-sm">
      <span className="text-slate-500 w-16 shrink-0">{label}:</span>
      <span className="text-slate-300">{value}</span>
    </div>
  ) : null
