import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Save, Upload, User } from 'lucide-react'
import { Button, Input, Card, CardTitle, Badge } from '../../components/ui'
import { useProfileStore } from '../../store'
import type { Project, Certificate, Skill } from '../../types'
import toast from 'react-hot-toast'
import {profileApi} from "../../api";

export const ProfileEditor = () => {
  const { companyProfile, isLoading, updateProfile, uploadPhoto } = useProfileStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const cvRef   = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    fullName: '', title: '', bio: '', email: '',
    phone: '', location: '', githubUrl: '', linkedinUrl: '', cvUrl: '',
  })
  const [projects,     setProjects]     = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [skills,       setSkills]       = useState<Skill[]>([])


  useEffect(() => {
    // Admin يجلب من endpoint مختلف
    profileApi.getAdmin().then((data) => {
      useProfileStore.setState({ companyProfile: data })
    })
  }, [])

  useEffect(() => {
    if (!companyProfile) return
    setForm({
      fullName:    companyProfile.fullName    ?? '',
      title:       companyProfile.title       ?? '',
      bio:         companyProfile.bio         ?? '',
      email:       companyProfile.email       ?? '',
      phone:       companyProfile.phone       ?? '',
      location:    companyProfile.location    ?? '',
      githubUrl:   companyProfile.githubUrl   ?? '',
      linkedinUrl: companyProfile.linkedinUrl ?? '',
      cvUrl:       companyProfile.cvUrl       ?? '',
    })
    setProjects(companyProfile.projects     ?? [])
    setCertificates(companyProfile.certificates ?? [])
    setSkills(companyProfile.skills         ?? [])
  }, [companyProfile])

  const handleSave = async () => {
    await updateProfile({ ...form, projects, certificates, skills })
    toast.success('تم حفظ البروفايل ✅')
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadPhoto(file)
    const updated= await profileApi.getAdmin()
    useProfileStore.setState({ companyProfile: updated })
    toast.success('تم رفع الصورة ✅')
  }

  const handleCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await profileApi.uploadCv(file)
    setForm(prev => ({ ...prev, cvUrl: url }))
    toast.success('تم رفع الـ CV ✅')
  }

  // ─── Projects helpers ────────────────────────────────────────────────────────
  const addProject = () => setProjects([...projects, {
    id: Date.now().toString(), title: '', description: '',
    technologies: [], githubLink: '', liveLink: '',
  }])

  const updateProject = (i: number, key: keyof Project, value: string | string[]) => {
    const updated = [...projects]
    updated[i] = { ...updated[i], [key]: value }
    setProjects(updated)
  }

  const removeProject = (i: number) =>
    setProjects(projects.filter((_, idx) => idx !== i))

  // ─── Certificates helpers ────────────────────────────────────────────────────
  const addCertificate = () => setCertificates([...certificates, {
    id: Date.now().toString(), title: '', issuer: '', date: '', credentialUrl: '',
  }])

  const updateCertificate = (i: number, key: keyof Certificate, value: string) => {
    const updated = [...certificates]
    updated[i] = { ...updated[i], [key]: value }
    setCertificates(updated)
  }

  const removeCertificate = (i: number) =>
    setCertificates(certificates.filter((_, idx) => idx !== i))

  // ─── Skills helpers ──────────────────────────────────────────────────────────
  const addSkill = () => setSkills([...skills, {
    name: '', level: 'Intermediate', category: 'Backend',
  }])

  const updateSkill = (i: number, key: keyof Skill, value: string) => {
    const updated = [...skills]
    updated[i] = { ...updated[i], [key]: value as Skill['level'] }
    setSkills(updated)
  }

  const removeSkill = (i: number) =>
    setSkills(skills.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">تعديل البروفايل</h2>
          <p className="text-slate-500 text-sm mt-1">كل ما تعدّله يظهر للشركات فوراً</p>
        </div>
        <Button onClick={handleSave} isLoading={isLoading}>
          <Save size={15} /> حفظ التغييرات
        </Button>
      </div>

      {/* Photo */}
      <Card>
        <CardTitle className="mb-4">الصورة الشخصية</CardTitle>
        <div className="flex items-center gap-6">
          {companyProfile?.photoUrl ? (
            <img src={companyProfile.photoUrl} alt="photo"
              className="w-20 h-20 rounded-xl object-cover ring-2 ring-primary-500/30" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center">
              <User size={32} className="text-slate-600" />
            </div>
          )}
          <div>
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> رفع صورة جديدة
            </Button>
            <p className="text-xs text-slate-600 mt-1">JPG, PNG — حتى 5MB</p>
            <input ref={fileRef} type="file" accept="image/*"
              className="hidden" onChange={handlePhoto} />
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardTitle className="mb-4">المعلومات الأساسية</CardTitle>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="الاسم الكامل"   value={form.fullName}    onChange={e => setForm({...form, fullName: e.target.value})}    placeholder="محمد أحمد" />
          <Input label="المسمى الوظيفي" value={form.title}       onChange={e => setForm({...form, title: e.target.value})}       placeholder="Full Stack Developer" />
          <Input label="البريد الإلكتروني" value={form.email}    onChange={e => setForm({...form, email: e.target.value})}       placeholder="example@email.com" />
          <Input label="الهاتف"          value={form.phone}       onChange={e => setForm({...form, phone: e.target.value})}       placeholder="+966500000000" />
          <Input label="الموقع"          value={form.location}    onChange={e => setForm({...form, location: e.target.value})}    placeholder="الرياض، السعودية" />
          <Input label="رابط CV"         value={form.cvUrl}       onChange={e => setForm({...form, cvUrl: e.target.value})}       placeholder="https://..." />
          <Input label="GitHub"          value={form.githubUrl}   onChange={e => setForm({...form, githubUrl: e.target.value})}   placeholder="https://github.com/..." />
          <Input label="LinkedIn"        value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-300 block mb-1.5">نبذة شخصية</label>
          <textarea rows={3} value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            placeholder="اكتب نبذة مختصرة عنك..."
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
          />
        </div>
      </Card>

      {/* CV */}
      <Card>
        <CardTitle className="mb-4">السيرة الذاتية (PDF)</CardTitle>
        <div className="flex items-center gap-6">
          {form.cvUrl ? (
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-sm">✅ CV مرفوع</span>
                <a href={`http://localhost:8080${form.cvUrl}`}
                   target="_blank" rel="noreferrer"
                   className="text-xs text-primary-400 hover:underline">
                  معاينة
                </a>
              </div>
          ) : (
              <span className="text-slate-500 text-sm">لم يُرفع CV بعد</span>
          )}
          <Button variant="secondary" size="sm" onClick={() => cvRef.current?.click()}>
            <Upload size={14} /> رفع CV جديد
          </Button>
          <input ref={cvRef} type="file" accept=".pdf"
                 className="hidden" onChange={handleCv} />
        </div>
      </Card>

      {/* Projects */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>المشاريع</CardTitle>
          <Button size="sm" variant="secondary" onClick={addProject}>
            <Plus size={14} /> إضافة مشروع
          </Button>
        </div>
        <div className="space-y-4">
          {projects.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-6">لا توجد مشاريع — أضف مشروعاً جديداً</p>
          )}
          {projects.map((p, i) => (
            <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="info">مشروع {i + 1}</Badge>
                <button onClick={() => removeProject(i)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="اسم المشروع"  value={p.title}       onChange={e => updateProject(i, 'title', e.target.value)}       placeholder="Portfolio Website" />
                <Input label="رابط GitHub"  value={p.githubLink ?? ''} onChange={e => updateProject(i, 'githubLink', e.target.value)} placeholder="https://github.com/..." />
                <Input label="رابط Demo"    value={p.liveLink ?? ''}   onChange={e => updateProject(i, 'liveLink', e.target.value)}   placeholder="https://..." />
                <Input label="التقنيات (افصل بفاصلة)" value={p.technologies.join(', ')}
                  onChange={e => updateProject(i, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="React, Java, MongoDB" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">الوصف</label>
                <textarea rows={2} value={p.description}
                  onChange={e => updateProject(i, 'description', e.target.value)}
                  placeholder="وصف مختصر للمشروع..."
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certificates */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>الشهادات</CardTitle>
          <Button size="sm" variant="secondary" onClick={addCertificate}>
            <Plus size={14} /> إضافة شهادة
          </Button>
        </div>
        <div className="space-y-4">
          {certificates.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-6">لا توجد شهادات — أضف شهادة جديدة</p>
          )}
          {certificates.map((c, i) => (
            <div key={c.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="success">شهادة {i + 1}</Badge>
                <button onClick={() => removeCertificate(i)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="اسم الشهادة"   value={c.title}         onChange={e => updateCertificate(i, 'title', e.target.value)}         placeholder="AWS Certified Developer" />
                <Input label="الجهة المانحة" value={c.issuer}        onChange={e => updateCertificate(i, 'issuer', e.target.value)}        placeholder="Amazon Web Services" />
                <Input label="التاريخ"        value={c.date}          onChange={e => updateCertificate(i, 'date', e.target.value)}          placeholder="2024-01" />
                <Input label="رابط التحقق"   value={c.credentialUrl ?? ''} onChange={e => updateCertificate(i, 'credentialUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>المهارات</CardTitle>
          <Button size="sm" variant="secondary" onClick={addSkill}>
            <Plus size={14} /> إضافة مهارة
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {skills.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-6 col-span-2">لا توجد مهارات — أضف مهارة جديدة</p>
          )}
          {skills.map((s, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Badge>{s.name || 'مهارة جديدة'}</Badge>
                <button onClick={() => removeSkill(i)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <Input label="اسم المهارة" value={s.name}
                onChange={e => updateSkill(i, 'name', e.target.value)}
                placeholder="React" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">المستوى</label>
                  <select value={s.level}
                    onChange={e => updateSkill(i, 'level', e.target.value)}
                    className="px-3 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">التصنيف</label>
                  <select value={s.category}
                    onChange={e => updateSkill(i, 'category', e.target.value)}
                    className="px-3 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button Bottom */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} isLoading={isLoading} size="lg">
          <Save size={16} /> حفظ كل التغييرات
        </Button>
      </div>

    </div>
  )
}
