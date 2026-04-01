import api from './axiosInstance'
import type {
  Company, CreateCompanyRequest,
  UpdateStatusRequest, TokenValidResponse,
} from '../interfaces'

export const companyApi = {
  // Admin
  create: (data: CreateCompanyRequest) =>
    api.post<Company>('/admin/companies', data).then(r => r.data),

  getAll: () =>
    api.get<Company[]>('/admin/companies').then(r => r.data),

  updateStatus: (id: string, data: UpdateStatusRequest) =>
    api.patch<Company>(`/admin/companies/${id}/status`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/admin/companies/${id}`),

  // Public
  validateToken: (token: string) =>
    api.get<TokenValidResponse>(`/public/validate/${token}`).then(r => r.data),
}
