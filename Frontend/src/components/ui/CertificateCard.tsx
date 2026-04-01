import { Award, ExternalLink } from 'lucide-react'
import type { Certificate } from '../../types'

export const CertificateCard = ({ title, issuer, date, imageUrl, credentialUrl }: Certificate) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 hover:border-primary-500/40 transition-colors duration-300">
    {/* Icon or image */}
    <div className="shrink-0">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-14 h-14 rounded-lg object-cover" />
      ) : (
        <div className="w-14 h-14 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <Award size={24} className="text-primary-400" />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-slate-100 truncate">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{issuer}</p>
      <p className="text-xs text-slate-600 mt-1">{date}</p>

      {credentialUrl && (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 mt-2 transition-colors"
        >
          <ExternalLink size={11} /> تحقق من الشهادة
        </a>
      )}
    </div>
  </div>
)
