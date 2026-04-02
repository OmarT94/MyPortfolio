import api from './axiosInstance'
import type { PublicProfile, CompanyProfile, UpdateProfileRequest } from '../types'

export const profileApi = {
  // Public
  getPublic: () =>
    api.get<PublicProfile>('/public/profile').then(r => r.data),

  // Company
  getCompany: () =>
    api.get<CompanyProfile>('/company/profile').then(r => r.data),

  // Admin
  update: (data: UpdateProfileRequest) =>
    api.put<CompanyProfile>('/admin/profile', data).then(r => r.data),

  getAdmin: () =>
      api.get<CompanyProfile>('/admin/profile').then(r => r.data),

  uploadPhoto: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<string>('/admin/profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}
