import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// ─── Request interceptor: أضف الـ token تلقائياً ─────────────────────────────
api.interceptors.request.use((config) => {
  // تحقق من نوع المستخدم وأضف الـ token المناسب
  const adminToken   = localStorage.getItem('adminToken')
  const companyToken = localStorage.getItem('companyToken')

  const token = adminToken ?? companyToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ─── Response interceptor: معالجة أخطاء 401 / 403 ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('companyToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
