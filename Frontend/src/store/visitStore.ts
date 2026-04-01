import { create } from 'zustand'
import type { Visit, CompanyStats } from '../types'
import { visitApi } from '../api'

interface VisitStore {
  visits: Visit[]
  stats: CompanyStats[]
  isLoading: boolean

  // Actions
  fetchAll: () => Promise<void>
  fetchStats: () => Promise<void>
}

export const useVisitStore = create<VisitStore>((set) => ({
  visits: [],
  stats: [],
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true })
    try {
      const data = await visitApi.getAll()
      set({ visits: data })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchStats: async () => {
    set({ isLoading: true })
    try {
      const data = await visitApi.getStats()
      set({ stats: data })
    } finally {
      set({ isLoading: false })
    }
  },
}))
