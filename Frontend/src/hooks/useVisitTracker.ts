import { useEffect, useRef } from 'react'

export const useVisitTracker = (companyToken: string | null) => {
  const visitedPages = useRef<Set<string>>(new Set(['profile', 'projects']))
  const startTime    = useRef<number>(Date.now())
  const hasSent      = useRef<boolean>(false)  // ← verhindert doppeltes Senden

  const trackPage = (page: string) => {
    visitedPages.current.add(page)
  }

  useEffect(() => {
    if (!companyToken) return

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
      navigator.sendBeacon('/api/public/visits/log', blob)

      // ─── Reset nach 2 Sekunden falls Seite noch offen ist (z.B. Download) ─
      setTimeout(() => { hasSent.current = false }, 2000)
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [companyToken])

  return { trackPage }
}