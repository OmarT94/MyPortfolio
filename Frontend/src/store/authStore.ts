import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../types'

interface AuthStore {
    token: string | null
    role: UserRole
    companyName: string | null
    _hydrated: boolean

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
            _hydrated: false,

            setAdminAuth: (token) =>
                set({ token, role: 'ADMIN', companyName: null }),

            setCompanyAuth: (token, companyName) =>
                set({ token, role: 'COMPANY', companyName }),

            logout: () =>
                set({ token: null, role: 'PUBLIC', companyName: null }),

            isAuthenticated: () => get().token !== null,
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                role: state.role,
                companyName: state.companyName,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) state._hydrated = true
            },
        }
    )
)