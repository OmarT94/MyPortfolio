import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor: أضف Token تلقائياً ─────────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ─── Response Interceptor: عالج انتهاء الجلسة ────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default api