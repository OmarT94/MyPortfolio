import api from './axiosInstance'
import type { Visit, LogVisitRequest, CompanyStats } from '../interfaces'

export const visitApi = {
  // Public
  log: (data: LogVisitRequest) =>
    api.post<Visit>('/public/visits/log', data).then(r => r.data),

  // Admin
  getAll: () =>
    api.get<Visit[]>('/admin/visits').then(r => r.data),

  getByCompany: (companyId: string) =>
    api.get<Visit[]>(`/admin/visits/company/${companyId}`).then(r => r.data),

  getStats: () =>
    api.get<CompanyStats[]>('/admin/visits/stats').then(r => r.data),
}
