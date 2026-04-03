import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18nStore, type Language } from '../../i18n'

const languages: { code: Language; label: string; color: string }[] = [
  { code: 'ar', label: 'AR', color: 'text-emerald-400' },
  { code: 'en', label: 'EN', color: 'text-blue-400'    },
  { code: 'de', label: 'DE', color: 'text-amber-400'   },
]

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18nStore()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find(l => l.code === language)!

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
      <div ref={ref} className="relative">

        {/* زر اللغة الحالية */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <span className={`text-xs font-bold ${current.color}`}>{current.label}</span>
          <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
            <div className="absolute top-full mt-1 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 min-w-[80px]">
              {languages.map(({ code, label, color }) => (
                  <button
                      key={code}
                      onClick={() => { setLanguage(code); setIsOpen(false) }}
                      className={`
                w-full flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors
                ${language === code ? 'bg-slate-700' : 'hover:bg-slate-700/50'}
                ${color}
              `}
                  >
                    {label}
                    {language === code && <span className="mr-auto text-slate-400">✓</span>}
                  </button>
              ))}
            </div>
        )}
      </div>
  )
}
