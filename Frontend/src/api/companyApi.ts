import type { Company, CreateCompanyRequest, UpdateStatusRequest, TokenValidResponse } from '../types'

const BASE = 'http://localhost:8080/api'

const getToken = () => {
  const raw = localStorage.getItem('auth-storage')
  if (!raw) return null
  try { return JSON.parse(raw).state?.token } catch { return null }
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export const companyApi = {
  getAll: async (): Promise<Company[]> => {
    const res = await fetch(`${BASE}/admin/companies`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },

  create: async (data: CreateCompanyRequest): Promise<Company> => {
    const res = await fetch(`${BASE}/admin/companies`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },

  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<Company> => {
    const res = await fetch(`${BASE}/admin/companies/${id}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${BASE}/admin/companies/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    })
  },

  validateToken: async (token: string): Promise<TokenValidResponse> => {
    const res = await fetch(`${BASE}/public/validate/${token}`)
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },
}