import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  try {
    // 1. Company token أولاً (sessionStorage — خاص بكل tab)
    const companyToken = sessionStorage.getItem('company-token')
    if (companyToken) {
      config.headers.Authorization = `Bearer ${companyToken}`
      return config  // ← ارجع فوراً
    }

    // 2. Admin token ثانياً (localStorage)
    const raw = localStorage.getItem('auth-storage')
    if (raw) {
      const token = JSON.parse(raw)?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch { /* ignore */ }
  return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export default api