import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  CompanyTokenRequest,
  CompanyTokenResponse,
} from '../types'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || ''

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('MyPortfolio_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authApi = {
  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post('/auth/admin/login', data)

    console.log("ADMIN LOGIN RESPONSE:", res.data)

    const token = res.data?.token

    if (token) {
      localStorage.setItem('MyPortfolio_token', token)
      console.log("Token gespeichert")
    } else {
      console.warn("Kein Token vom Server erhalten")
    }

    return res.data
  },

  companyLogin: async (
      data: CompanyTokenRequest
  ): Promise<CompanyTokenResponse> => {
    const res = await api.post('/auth/company/login', data)

    console.log("COMPANY LOGIN RESPONSE:", res.data)

    const token = res.data?.token

    if (token) {
      localStorage.setItem('MyPortfolio_token', token)
    } else {
      console.warn("Kein Token vom Server erhalten")
    }

    return res.data
  },
}