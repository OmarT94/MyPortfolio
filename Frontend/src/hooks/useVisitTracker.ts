import { useEffect, useRef } from 'react'

export const useVisitTracker = (companyToken: string | null) => {
  const visitedPages = useRef<Set<string>>(new Set(['profile', 'projects']))
  const startTime = useRef<number>(0)  // ← 0 statt Date.now()
  const hasSent      = useRef<boolean>(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const trackPage = (page: string) => {
    visitedPages.current.add(page)
  }

  useEffect(() => {
    if (!companyToken) return
    startTime.current = Date.now()  // ← hier initialisieren

    const sendData = () => {
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

      setTimeout(() => { hasSent.current = false }, 2000)
    }

    // ← für Desktop
    window.addEventListener('beforeunload', sendData)
    // ← für iOS Safari
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendData()
    })

    return () => {
      window.removeEventListener('beforeunload', sendData)
      document.removeEventListener('visibilitychange', sendData)
    }
  }, [companyToken])

  return { trackPage }
}