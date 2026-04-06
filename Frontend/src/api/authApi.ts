import axios from 'axios';
import type {
  LoginRequest, LoginResponse,
  CompanyTokenRequest, CompanyTokenResponse,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
    const res = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  companyLogin: async (data: CompanyTokenRequest): Promise<CompanyTokenResponse> => {
    const res = await fetch(`${BASE_URL}/auth/company/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },
}