import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../types'

interface AuthStore {
  token: string | null
  role: UserRole
  companyName: string | null

  // Actions
  setAdminAuth: (token: string) => void
  setCompanyAuth: (token: string, companyName: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      role: 'PUBLIC',
      companyName: null,

      // ─── Admin تسجيل دخول ──────────────────────────────────────────────────
      setAdminAuth: (token) =>
        set({ token, role: 'ADMIN', companyName: null }),

      // ─── Company تسجيل دخول ────────────────────────────────────────────────
      setCompanyAuth: (token, companyName) =>
        set({ token, role: 'COMPANY', companyName }),

      // ─── تسجيل خروج ────────────────────────────────────────────────────────
      logout: () =>
        set({ token: null, role: 'PUBLIC', companyName: null }),

      // ─── هل هو مسجّل دخول؟ ─────────────────────────────────────────────────
      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'auth-storage', // اسم الـ key في localStorage
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        companyName: state.companyName,
      }),
    }
  )
)
