import api from './axiosInstance'
import type {
  LoginRequest, LoginResponse,
  CompanyTokenRequest, CompanyTokenResponse,
} from '../interfaces'

export const authApi = {
  adminLogin: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/admin/login', data).then(r => r.data),

  companyLogin: (data: CompanyTokenRequest) =>
    api.post<CompanyTokenResponse>('/auth/company/login', data).then(r => r.data),
}
