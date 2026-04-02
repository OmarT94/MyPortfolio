import type {
  LoginRequest, LoginResponse,
  CompanyTokenRequest, CompanyTokenResponse,
} from '../types'

const BASE = 'http://localhost:8080/api'

export const authApi = {
  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await fetch(`${BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  companyLogin: async (data: CompanyTokenRequest): Promise<CompanyTokenResponse> => {
    const res = await fetch(`${BASE}/auth/company/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },
}