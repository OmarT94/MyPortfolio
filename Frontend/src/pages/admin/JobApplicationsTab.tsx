import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, FileDown, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, EmptyState, Spinner } from '../../components/ui'
import { useJobApplicationStore } from '../../store/jobApplicationStore'
import { JobApplicationForm } from './JobApplicationForm'
import { STATUS_CONFIG } from '../../types'   // ← من types/index.ts مباشرة
import type { JobApplication, ApplicationStatus } from '../../types'  // ← من types/index.ts مباشرة

export const JobApplicationsTab = () => {
  const {
    applications, isLoading, isExporting, error, pdfUrl,
    fetchAll, create, update, updateStatus, remove, exportPdf,
    clearError, clearPdfUrl,
  } = useJobApplicationStore()

  const [showForm, setShowForm]     = useState(false)
  const [editItem, setEditItem]     = useState<JobApplication | null>(null)
  const [openStatus, setOpenStatus] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    if (error) { toast.error(error); clearError() }
  }, [error, clearError])

  useEffect(() => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
      toast.success('PDF erfolgreich exportiert!')
      clearPdfUrl()
    }
  }, [pdfUrl, clearPdfUrl])

  const handleEdit = (app: JobApplication) => { setEditItem(app); setShowForm(true) }
  const handleClose = () => { setShowForm(false); setEditItem(null) }

  const handleSubmit = async (data: any) => {
    if (editItem) { await update(editItem.id, data); toast.success('Bewerbung aktualisiert!') }
    else          { await create(data);               toast.success('Bewerbung hinzugefügt!') }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bewerbung bei "${name}" wirklich löschen?`)) return
    await remove(id)
    toast.success('Bewerbung gelöscht!')
  }

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateStatus(id, status)
    setOpenStatus(null)
    toast.success('Status aktualisiert!')
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const stats = [
    { label: 'Gesamt',     value: applications.length,                                                   color: 'text-slate-300'   },
    { label: 'Ausstehend', value: applications.filter(a => a.status === 'AUSSTEHEND').length,            color: 'text-amber-400'   },
    { label: 'Gespräch',   value: applications.filter(a => a.status === 'VORSTELLUNGSGESPRAECH').length, color: 'text-purple-400'  },
    { label: 'Angenommen', value: applications.filter(a => a.status === 'ANGENOMMEN').length,            color: 'text-emerald-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Bewerbungsübersicht</h2>
          <p className="text-slate-500 text-sm mt-0.5">Verwalte deine Jobbewerbungen</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportPdf} isLoading={isExporting}>
            <FileDown size={15} /> PDF exportieren
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Neue Bewerbung
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="md" /></div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<FileDown size={40} />}
            title="Keine Bewerbungen vorhanden"
            description="Füge deine erste Bewerbung hinzu"
            action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={15} /> Hinzufügen</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs">
                  <th className="text-right px-5 py-3 font-medium">Firma</th>
                  <th className="text-right px-5 py-3 font-medium">Stelle</th>
                  <th className="text-right px-5 py-3 font-medium">Ansprechpartner</th>
                  <th className="text-right px-5 py-3 font-medium">Datum</th>
                  <th className="text-right px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Notizen</th>
                  <th className="text-right px-5 py-3 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {applications.map((app) => {
                  const cfg = STATUS_CONFIG[app.status]
                  return (
                    <tr key={app.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4"><p className="font-semibold text-slate-100">{app.companyName}</p></td>
                      <td className="px-5 py-4 text-slate-300">{app.jobTitle}</td>
                      <td className="px-5 py-4 text-slate-400">{app.contactPerson || '—'}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{formatDate(app.applicationDate)}</td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenStatus(openStatus === app.id ? null : app.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${cfg.bg} ${cfg.color}`}
                          >
                            {cfg.label} <ChevronDown size={11} />
                          </button>
                          {openStatus === app.id && (
                            <div className="absolute top-8 left-0 z-20 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                              {Object.entries(STATUS_CONFIG).map(([value, c]) => (
                                <button
                                  key={value}
                                  onClick={() => handleStatusChange(app.id, value as ApplicationStatus)}
                                  className={`w-full text-right px-4 py-2.5 text-xs hover:bg-slate-700 transition-colors ${c.color} ${app.status === value ? 'bg-slate-700 font-bold' : ''}`}
                                >
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs max-w-[150px] truncate">{app.notes || '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(app)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(app.id, app.companyName)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <JobApplicationForm isOpen={showForm} onClose={handleClose} onSubmit={handleSubmit} editData={editItem} isLoading={isLoading} />
      {openStatus && <div className="fixed inset-0 z-10" onClick={() => setOpenStatus(null)} />}
    </div>
  )
}
