import { create } from 'zustand'
import type { Company, CreateCompanyRequest } from '../types'
import {companyApi} from "../api";


interface CompanyStore {
  companies: Company[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchAll: () => Promise<void>
  create: (data: CreateCompanyRequest) => Promise<Company>
  toggleStatus: (id: string, currentStatus: boolean) => Promise<void>
  remove: (id: string) => Promise<void>
  clearError: () => void
}

export const useCompanyStore
    = create<CompanyStore>((set) => ({
  companies: [],
  isLoading: false,
  error: null,

  // ─── جلب كل الشركات ─────────────────────────────────────────────────────────
  fetchAll: async () => {
    try {
      const data = await companyApi.getAll()
      set({ companies: data })
    } catch {
      set({ error: 'فشل تحميل الشركات' })
    }
  },

  // ─── إنشاء شركة جديدة ───────────────────────────────────────────────────────
  create: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const company = await companyApi.create(data)
      set((state) => ({ companies: [company, ...state.companies] }))
      return company
    } catch {
      set({ error: 'فشل إنشاء الشركة' })
      throw new Error('فشل إنشاء الشركة')
    } finally {
      set({ isLoading: false })
    }
  },

  // ─── تفعيل / إلغاء تفعيل الرابط ────────────────────────────────────────────
  toggleStatus: async (id, currentStatus) => {
    try {
      const updated = await companyApi.updateStatus(id, { isActive: !currentStatus })
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? updated : c)),
      }))
    } catch {
      set({ error: 'فشل تحديث الحالة' })
    }
  },

  // ─── حذف شركة ───────────────────────────────────────────────────────────────
  remove: async (id) => {
    try {
      await companyApi.delete(id)
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
      }))
    } catch {
      set({ error: 'فشل حذف الشركة' })
    }
  },

  clearError: () => set({ error: null }),
}))
