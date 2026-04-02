import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../types'

interface AuthStore {
    token: string | null
    role: UserRole
    companyName: string | null
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
            setAdminAuth: (token) =>
                set({ token, role: 'ADMIN', companyName: null }),
            setCompanyAuth: (token, companyName) => {
                // احفظ في sessionStorage منفصل عن الـ persist
                sessionStorage.setItem('company-token', token)
                sessionStorage.setItem('company-name', companyName ?? '')
                // لا تكتب في الـ store — حتى لا يلوث localStorage
            },
            logout: () =>
                set({ token: null, role: 'PUBLIC', companyName: null }),
            isAuthenticated: () => get().token !== null,
        }),
        { name: 'auth-storage' }
    )
)