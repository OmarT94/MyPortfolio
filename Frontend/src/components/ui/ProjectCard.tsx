import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import type { Project } from '../../types'

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
)

export const ProjectCard = ({ title, description, githubLink, liveLink, technologies, imageUrl }: Project) => (
    <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-colors duration-300"
    >
        {/* Image */}
        {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-44 object-cover" />
        ) : (
            <div className="w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <span className="text-4xl">💻</span>
            </div>
        )}

        <div className="p-5 space-y-3">
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                    <Badge key={tech} variant="info">{tech}</Badge>
                ))}
            </div>

            {/* Links */}
            <div className="flex gap-3 pt-1">
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
)
