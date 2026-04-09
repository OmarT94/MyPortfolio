import { create } from 'zustand'
import { jobApplicationApi } from '../api/jobApplicationApi'
import type {
  JobApplication,
  CreateJobApplicationRequest,
  ApplicationStatus,
} from '../types'  // ← من types/index.ts مباشرة

interface JobApplicationStore {
  applications: JobApplication[]
  isLoading:    boolean
  isExporting:  boolean
  error:        string | null
  pdfUrl:       string | null

  fetchAll:     () => Promise<void>
  create:       (data: CreateJobApplicationRequest) => Promise<void>
  update:       (id: string, data: CreateJobApplicationRequest) => Promise<void>
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>
  remove:       (id: string) => Promise<void>
  exportPdf:    () => Promise<void>
  clearError:   () => void
  clearPdfUrl:  () => void
}

export const useJobApplicationStore = create<JobApplicationStore>((set) => ({
  applications: [],
  isLoading:    false,
  isExporting:  false,
  error:        null,
  pdfUrl:       null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await jobApplicationApi.getAll()
      set({ applications: data })
    } catch {
      set({ error: 'Fehler beim Laden der Bewerbungen' })
    } finally {
      set({ isLoading: false })
    }
  },

  create: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newApp = await jobApplicationApi.create(data)
      set((state) => ({ applications: [newApp, ...state.applications] }))
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Fehler beim Erstellen'
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ isLoading: false })
    }
  },

  update: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await jobApplicationApi.update(id, data)
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? updated : a)),
      }))
    } catch {
      set({ error: 'Fehler beim Aktualisieren' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await jobApplicationApi.updateStatus(id, { status })
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? updated : a)),
      }))
    } catch {
      set({ error: 'Fehler beim Status-Update' })
    }
  },

  remove: async (id) => {
    try {
      await jobApplicationApi.delete(id)
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== id),
      }))
    } catch {
      set({ error: 'Fehler beim Löschen' })
    }
  },

  exportPdf: async () => {
    set({ isExporting: true, error: null })
    try {
      const res = await jobApplicationApi.exportPdf()
      set({ pdfUrl: res.pdfUrl })
    } catch {
      set({ error: 'Fehler beim PDF-Export' })
    } finally {
      set({ isExporting: false })
    }
  },

  clearError:  () => set({ error: null }),
  clearPdfUrl: () => set({ pdfUrl: null }),
}))
