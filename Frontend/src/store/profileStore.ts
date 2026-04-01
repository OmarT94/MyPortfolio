import { create } from 'zustand'
import type { PublicProfile, CompanyProfile, UpdateProfileRequest } from '../types'
import { profileApi } from '../api'

interface ProfileStore {
  publicProfile: PublicProfile | null
  companyProfile: CompanyProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchPublic: () => Promise<void>
  fetchCompany: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  uploadPhoto: (file: File) => Promise<void>
  clearError: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  publicProfile: null,
  companyProfile: null,
  isLoading: false,
  error: null,

  // ─── جلب البروفايل العام ────────────────────────────────────────────────────
  fetchPublic: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await profileApi.getPublic()
      set({ publicProfile: data })
    } catch {
      set({ error: 'فشل تحميل البروفايل' })
    } finally {
      set({ isLoading: false })
    }
  },

  // ─── جلب البروفايل الكامل (للشركة) ─────────────────────────────────────────
  fetchCompany: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await profileApi.getCompany()
      set({ companyProfile: data })
    } catch {
      set({ error: 'فشل تحميل البيانات' })
    } finally {
      set({ isLoading: false })
    }
  },

  // ─── تحديث البروفايل (Admin) ────────────────────────────────────────────────
  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await profileApi.update(data)
      set({ companyProfile: updated })
    } catch {
      set({ error: 'فشل تحديث البروفايل' })
    } finally {
      set({ isLoading: false })
    }
  },

  // ─── رفع الصورة الشخصية ─────────────────────────────────────────────────────
  uploadPhoto: async (file) => {
    set({ isLoading: true, error: null })
    try {
      const photoUrl = await profileApi.uploadPhoto(file)
      set((state) => ({
        publicProfile: state.publicProfile
          ? { ...state.publicProfile, photoUrl }
          : null,
        companyProfile: state.companyProfile
          ? { ...state.companyProfile, photoUrl }
          : null,
      }))
    } catch {
      set({ error: 'فشل رفع الصورة' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
