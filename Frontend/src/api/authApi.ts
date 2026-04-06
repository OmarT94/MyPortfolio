import axios from 'axios';
import type {
  LoginRequest, LoginResponse,
  CompanyTokenRequest, CompanyTokenResponse,
} from '../types'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('MyPortfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  adminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post('/auth/admin/login', data)

    if (res.data.token) {
      localStorage.setItem('MyPortfolio_token', res.data.token)
    }

    return res.data
  },

  companyLogin: async (data: CompanyTokenRequest): Promise<CompanyTokenResponse> => {
    const res = await api.post('/auth/company/login', data)

    if (res.data.token) {
      localStorage.setItem('MyPortfolio_token', res.data.token)
    }

    return res.data
  }
}