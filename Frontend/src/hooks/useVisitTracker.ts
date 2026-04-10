import { useEffect, useRef } from 'react'


// يتتبع الصفحات التي تزورها الشركة ويسجّلها عند مغادرة الصفحة
export const useVisitTracker = (companyToken: string | null) => {
  // profile + projects beim Start tracken
  const visitedPages = useRef<Set<string>>(new Set(['profile', 'projects']))
  const startTime = useRef<number>(Date.now())

  const trackPage = (page: string) => {
    visitedPages.current.add(page)
  }

  useEffect(() => {
    if (!companyToken) return

    const handleUnload = () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      // sendBeacon لضمان الإرسال حتى عند إغلاق المتصفح
      const blob = new Blob(
          [JSON.stringify({
            companyToken,
            pagesViewed: Array.from(visitedPages.current),
            durationSeconds: duration,
          })],
          { type: 'application/json' }
      )
      navigator.sendBeacon('/api/public/visits/log', blob)
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [companyToken])

  return { trackPage }
}