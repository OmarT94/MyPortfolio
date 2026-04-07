import ar from './ar.json'
import en from './en.json'
import de from './de.json'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Language = 'ar' | 'en' | 'de'

const translations = { ar, en, de }

// ─── i18n Store ───────────────────────────────────────────────────────────────
interface I18nStore {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (language) => {
        // تغيير اتجاه الصفحة حسب اللغة
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = language
        set({ language })
      },
    }),
      {
        name: 'i18n-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
  )
)

// ─── Hook للترجمة ─────────────────────────────────────────────────────────────
export const useT = () => {
  const { language } = useI18nStore()
  const t = translations[language] as typeof ar

  // دالة للوصول للترجمة بالـ dot notation مثل t('admin.dashboard')
  const translate = (key: string): string => {
    const keys = key.split('.')
    let result: unknown = t
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[k]
      } else {
        return key // fallback للـ key نفسه
      }
    }
    return typeof result === 'string' ? result : key
  }

  return { t: translate, language }
}

// ─── تطبيق اتجاه الصفحة عند التحميل ─────────────────────────────────────────
export const initI18n = () => {
  const stored = sessionStorage.getItem('i18n-storage')
  if (stored) {
    const { state } = JSON.parse(stored)
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = state.language ?? 'ar'
  }
}
