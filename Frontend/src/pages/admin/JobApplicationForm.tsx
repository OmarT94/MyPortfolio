import { useState, useEffect } from 'react'
import { Modal, Button, Input } from '../../components/ui'
import { STATUS_CONFIG } from '../../types'   // ← من types/index.ts مباشرة
import type {
  JobApplication,
  CreateJobApplicationRequest,
  ApplicationStatus,
} from '../../types'  // ← من types/index.ts مباشرة

interface Props {
  isOpen:    boolean
  onClose:   () => void
  onSubmit:  (data: CreateJobApplicationRequest) => Promise<void>
  editData?: JobApplication | null
  isLoading: boolean
}

const EMPTY: CreateJobApplicationRequest = {
  companyName:     '',
  jobTitle:        '',
  contactPerson:   '',
  applicationDate: new Date().toISOString().split('T')[0],
  status:          'AUSSTEHEND',
  notes:           '',
}

export const JobApplicationForm = ({ isOpen, onClose, onSubmit, editData, isLoading }: Props) => {
  const [form, setForm]   = useState<CreateJobApplicationRequest>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editData) {
      setForm({
        companyName:     editData.companyName,
        jobTitle:        editData.jobTitle,
        contactPerson:   editData.contactPerson ?? '',
        applicationDate: editData.applicationDate,
        status:          editData.status,
        notes:           editData.notes ?? '',
      })
    } else {
      setForm(EMPTY)
    }
    setError(null)
  }, [editData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(form)
      onClose()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? '✏️ Bewerbung bearbeiten' : '➕ Neue Bewerbung'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Firmenname *"
            placeholder="z.B. BMW"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
          />
          <Input
            label="Art der Stelle *"
            placeholder="z.B. Backend Developer"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Ansprechpartner"
            placeholder="z.B. Hr. Müller"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          />
          <Input
            label="Bewerbungsdatum"
            type="date"
            value={form.applicationDate}
            onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Notizen</label>
          <textarea
            rows={3}
            placeholder="Zusätzliche Informationen..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            {editData ? 'Speichern' : 'Hinzufügen'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Modal>
  )
}
