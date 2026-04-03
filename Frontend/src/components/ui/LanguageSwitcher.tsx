import { useI18nStore, type Language } from '../../i18n'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
]

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18nStore()

  return (
    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all
            ${language === code
              ? 'bg-primary-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
            }
          `}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
