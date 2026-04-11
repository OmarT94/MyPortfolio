import { Award, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Certificate } from '../../types'
import { useI18nStore } from '../../i18n'

export const CertificateCard = ({ title, issuer, date, imageUrl, credentialUrl,
                                    title_ar, title_en, title_de, issuer_ar, issuer_en, issuer_de }: Certificate) => {

    // ─── Sprache auswählen ────────────────────────────────────────────────────
    const { language } = useI18nStore()
    const localTitle  = (language === 'ar' ? title_ar :
        language === 'en' ? title_en :
            title_de) || title
    const localIssuer = (language === 'ar' ? issuer_ar :
        language === 'en' ? issuer_en :
            issuer_de) || issuer

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 hover:border-primary-500/40 transition-colors duration-300 h-full items-start"
        >
            {/* Icon or image */}
            <div className="shrink-0">
                {imageUrl ? (
                    <img src={imageUrl} alt={localTitle} className="w-14 h-14 rounded-lg object-cover" />
                ) : (
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-14 h-14 bg-primary-500/10 rounded-lg flex items-center justify-center"
                    >
                        <Award size={24} className="text-primary-400" />
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0 gap-1">
                <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 break-words">{localTitle}</h3>
                <p className="text-xs text-slate-400 truncate">{localIssuer}</p>
                <p className="text-xs text-slate-600">{date}</p>

                {credentialUrl && (
                    <a href={credentialUrl} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 mt-auto pt-2 transition-colors">
                        <ExternalLink size={11} /> تحقق من الشهادة
                    </a>
                )}
            </div>
        </motion.div>
    )
}
