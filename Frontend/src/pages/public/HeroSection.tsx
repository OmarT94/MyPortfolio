import { Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui'
import type { PublicProfile } from '../../types'
import { useT, useI18nStore } from '../../i18n'

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
)

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

interface HeroSectionProps {
    profile: PublicProfile
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
    const { t } = useT()
    const { language } = useI18nStore()

    // ─── اختر البيانات حسب اللغة ──────────────────────────────────────
    const fullName = (language === 'ar' ? profile.fullName_ar :
        language === 'en' ? profile.fullName_en :
            profile.fullName_de) || profile.fullName

    const title = (language === 'ar' ? profile.title_ar :
        language === 'en' ? profile.title_en :
            profile.title_de) || profile.title

    const bio = (language === 'ar' ? profile.bio_ar :
        language === 'en' ? profile.bio_en :
            profile.bio_de) || profile.bio

    const location = (language === 'ar' ? profile.location_ar :
        language === 'en' ? profile.location_en :
            profile.location_de) || profile.location

    return (
        <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">

                {/* Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex justify-center"
                >
                    {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt={fullName}
                             className="w-32 h-32 rounded-full object-cover object-[center_25%] ring-4 ring-primary-500/30 shadow-2xl shadow-primary-500/20" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center ring-4 ring-primary-500/30">
                            <span className="text-4xl font-bold text-white">
                                {fullName?.charAt(0) ?? '?'}
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Name & Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-3"
                >
                    <p className="text-primary-400 font-medium">{t('hero.greeting')}</p>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-100 tracking-tight">
                        {fullName}
                    </h1>
                    <p className="text-xl text-primary-400 font-medium">{title}</p>
                </motion.div>

                {/* Bio */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    {bio}
                </motion.p>

                {/* Meta info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center gap-6 text-sm text-slate-500"
                >
                    {location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary-400" />
                            {location}
                        </span>
                    )}
                    {profile.email && (
                        <a href={`mailto:${profile.email}`}
                           className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                            <Mail size={14} className="text-primary-400" />
                            {profile.email}
                        </a>
                    )}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center justify-center gap-4"
                >
                    <a href="https://github.com" target="_blank" rel="noreferrer"
                       className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors">
                        <GitHubIcon />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                       className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors">
                        <LinkedInIcon />
                    </a>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex justify-center pt-2"
                >
                    <Button size="lg"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        {t('hero.contactMe')}
                    </Button>
                </motion.div>

            </div>
        </section>
    )
}