import { useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from './Badge'
import type { Project } from '../../types'
import { useI18nStore } from '../../i18n'

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
)

export const ProjectCard = ({ title, description, githubLink, liveLink, technologies, imageUrl,
                                title_ar, title_en, title_de, description_ar, description_en, description_de }: Project) => {

    const { language } = useI18nStore()
    const [showModal, setShowModal] = useState(false)

    const localTitle = (language === 'ar' ? title_ar :
        language === 'en' ? title_en :
            title_de) || title

    const localDesc  = (language === 'ar' ? description_ar :
        language === 'en' ? description_en :
            description_de) || description

    const isLong = localDesc && localDesc.length > 120

    return (
        <>
            {/* ─── Card ──────────────────────────────────────────────────────── */}
            <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-colors duration-300 flex flex-col h-full"
            >
                {/* Image */}
                {imageUrl ? (
                    <img src={imageUrl} alt={localTitle} className="w-full h-44 object-cover shrink-0" />
                ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0">
                        <span className="text-4xl">💻</span>
                    </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3 flex flex-col flex-1">
                    <h3 className="text-base font-semibold text-slate-100">{localTitle}</h3>

                    {/* Description — immer 3 Zeilen */}
                    <div className="flex-1">
                        <p className="text-sm text-slate-400 line-clamp-3">{localDesc}</p>
                        {isLong && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-xs text-primary-400 hover:text-primary-300 mt-1.5 transition-colors underline underline-offset-2"
                            >
                                mehr lesen
                            </button>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5">
                        {technologies.map((tech) => (
                            <Badge key={tech} variant="info">{tech}</Badge>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-1 mt-auto">
                        {githubLink && (
                            <a href={githubLink} target="_blank" rel="noreferrer"
                               className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors">
                                <GitHubIcon /> GitHub
                            </a>
                        )}
                        {liveLink && (
                            <a href={liveLink} target="_blank" rel="noreferrer"
                               className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-400 transition-colors">
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ─── Modal ─────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{opacity: 0, scale: 0.95, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.95, y: 20}}
                            transition={{duration: 0.2}}
                            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-lg font-bold text-slate-100">{localTitle}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                                >
                                    <X size={16}/>
                                </button>
                            </div>

                            {/* Full Description */}
                            <p className="text-sm text-slate-400 leading-relaxed break-all">{localDesc}</p>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-1.5">
                                {technologies.map((tech) => (
                                    <Badge key={tech} variant="info">{tech}</Badge>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-4 pt-1">
                                {githubLink && (
                                    <a href={githubLink} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors">
                                        <GitHubIcon/> GitHub
                                    </a>
                                )}
                                {liveLink && (
                                    <a href={liveLink} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary-400 transition-colors">
                                        <ExternalLink size={14}/> Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
