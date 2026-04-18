import { useEffect, useRef } from 'react'

export const useVisitTracker = (companyToken: string | null) => {
  const visitedPages = useRef<Set<string>>(new Set(['profile', 'projects']))
  const startTime = useRef<number>(0)  // ← 0 statt Date.now()
  const hasSent      = useRef<boolean>(false)  // ← verhindert doppeltes Senden
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const trackPage = (page: string) => {
    visitedPages.current.add(page)
  }

  useEffect(() => {
    if (!companyToken) return
    startTime.current = Date.now()

    const handleUnload = () => {
      // ─── Bereits gesendet? → abbrechen ───────────────────────────────────
      if (hasSent.current) return
      hasSent.current = true

      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      const blob = new Blob(
          [JSON.stringify({
            companyToken,
            pagesViewed: Array.from(visitedPages.current),
            durationSeconds: duration,
          })],
          { type: 'application/json' }
      )
      navigator.sendBeacon(`${backendUrl}/api/public/visits/log`, blob)

      // ─── Reset nach 2 Sekunden falls Seite noch offen ist (z.B. Download) ─
      setTimeout(() => { hasSent.current = false }, 2000)
    }

    // ─── iOS Safari Fix: visibilitychange ────────────────────────────────
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleUnload()
    }

    // ← für Desktop
    window.addEventListener('beforeunload', handleUnload)
    // ← für iOS Safari
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [companyToken])

  return { trackPage }
}