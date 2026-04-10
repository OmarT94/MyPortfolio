import { useState } from 'react'
import { Plus, Copy, Trash2, ToggleLeft, ToggleRight, Check, ExternalLink } from 'lucide-react'
import { Button, Badge, Modal, Input } from '../../components/ui'
import { useCompanyStore } from '../../store'
import type { Company } from '../../types'

export const CompanyTable = () => {
  const { companies, create, toggleStatus, remove, isLoading } = useCompanyStore()
  const [showModal, setShowModal] = useState(false)
  const [copiedId, setCopiedId]   = useState<string | null>(null)
  const [form, setForm]           = useState({
    name:          '',
    expiresInDays: 30,
    language:      'en',
    jobTitle:      '',   // ← neu
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await create(form)
    setForm({ name: '', expiresInDays: 30, language: 'en', jobTitle: '' })
    setShowModal(false)
  }

  const handleCopy = (company: Company) => {
    navigator.clipboard.writeText(company.magicLink)
    setCopiedId(company.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateStr: string) =>
      new Date(dateStr).toLocaleDateString('ar-SA', {
        year: 'numeric', month: 'short', day: 'numeric',
      })

  return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">الشركات والروابط</h2>
          <Button onClick={() => setShowModal(true)} size="sm">
            <Plus size={15} /> شركة جديدة
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-xs">
              <th className="text-right px-5 py-3 font-medium">الشركة</th>
              <th className="text-right px-5 py-3 font-medium">الحالة</th>
              <th className="text-right px-5 py-3 font-medium">الزيارات</th>
              <th className="text-right px-5 py-3 font-medium">ينتهي</th>
              <th className="text-right px-5 py-3 font-medium">إجراءات</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
            {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-600">
                    لا توجد شركات — أضف شركة جديدة
                  </td>
                </tr>
            ) : (
                companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-800/30 transition-colors">

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-200">{company.name}</p>
                        <p className="text-xs text-slate-600 mt-0.5 truncate max-w-[180px]">
                          {company.token}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={company.active ? 'success' : 'danger'}>
                          {company.active ? 'نشط' : 'معطّل'}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {company.visitCount} زيارة
                      </td>

                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {formatDate(company.expiresAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                              onClick={() => handleCopy(company)}
                              title="نسخ الرابط"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800 transition-colors"
                          >
                            {copiedId === company.id
                                ? <Check size={15} className="text-emerald-400" />
                                : <Copy size={15} />}
                          </button>

                          <a
                              href={company.magicLink}
                              target="_blank"
                              rel="noreferrer"
                              title="فتح الرابط"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-slate-800 transition-colors"
                          >
                            <ExternalLink size={15} />
                          </a>

                          <button
                              onClick={() => toggleStatus(company.id, company.active)}
                              title={company.active ? 'تعطيل' : 'تفعيل'}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            {company.active
                                ? <ToggleRight size={15} className="text-emerald-400" />
                                : <ToggleLeft size={15} />}
                          </button>

                          <button
                              onClick={() => remove(company.id)}
                              title="حذف"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة شركة جديدة">
          <form onSubmit={handleCreate} className="space-y-4">

            <Input
                label="اسم الشركة *"
                placeholder="مثال: BMW"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />

            {/* ← neu: Art der Stelle */}
            <Input
                label="Art der Stelle *"
                placeholder="z.B. Backend Developer"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                required
            />

            <Input
                label="صلاحية الرابط (أيام)"
                type="number"
                min={1}
                max={365}
                value={form.expiresInDays}
                onChange={(e) => setForm({ ...form, expiresInDays: Number(e.target.value) })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">لغة الشركة</label>
              <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="px-3 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-xs text-blue-400">
              ℹ️ Es wird automatisch eine Bewerbung mit Status "In Bearbeitung" erstellt
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                إنشاء الرابط
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </Modal>
      </div>
  )
}
