import { useEffect, useRef } from 'react'


// يتتبع الصفحات التي تزورها الشركة ويسجّلها عند مغادرة الصفحة
export const useVisitTracker = (companyToken: string | null) => {
  const visitedPages = useRef<Set<string>>(new Set())
  const startTime = useRef<number>(Date.now())

  const trackPage = (page: string) => {
    visitedPages.current.add(page)
  }

  useEffect(() => {
    if (!companyToken) return

    const handleUnload = () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      // sendBeacon لضمان الإرسال حتى عند إغلاق المتصفح
      navigator.sendBeacon(
        '/api/public/visits/log',
        JSON.stringify({
          companyToken,
          pagesViewed: Array.from(visitedPages.current),
          durationSeconds: duration,
        })
      )
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [companyToken])

  return { trackPage }
}
