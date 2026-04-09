import api from './axiosInstance'
import type {
  JobApplication,
  CreateJobApplicationRequest,
  UpdateJobStatusRequest,
  PdfResponse,
} from '../types'  // ← من types/index.ts مباشرة

export const jobApplicationApi = {

  getAll: () =>
    api.get<JobApplication[]>
    ('/admin/job-applications').then(r => r.data),

  create: (data: CreateJobApplicationRequest) =>
    api.post<JobApplication>
    ('/admin/job-applications', data).then(r => r.data),

  update: (id: string, data: CreateJobApplicationRequest) =>
    api.put<JobApplication>
    (`/admin/job-applications/${id}`, data).then(r => r.data),

  updateStatus: (id: string, data: UpdateJobStatusRequest) =>
    api.patch<JobApplication>
    (`/admin/job-applications/${id}/status`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/admin/job-applications/${id}`),

  exportPdf: () =>
    api.post<PdfResponse>
    ('/admin/job-applications/export-pdf').then(r => r.data),
}
