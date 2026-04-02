import { useState } from 'react'
import { Mail, Send, MapPin } from 'lucide-react'
import { Button, Input, Card } from '../../components/ui'
import type { PublicProfile } from '../../types'

interface ContactSectionProps {
  profile: PublicProfile
}

export const ContactSection = ({ profile }: ContactSectionProps) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // فتح تطبيق الإيميل مباشرة
    const subject = encodeURIComponent(`رسالة من ${form.name}`)
    const body    = encodeURIComponent(`الاسم: ${form.name}\nالإيميل: ${form.email}\n\n${form.message}`)
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-primary-500/10 rounded-lg">
            <Mail size={20} className="text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100">تواصل معي</h2>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Info */}
          <div className="space-y-6">
            <p className="text-slate-400 leading-relaxed">
              يسعدني التواصل معك! سواء كانت لديك فرصة عمل أو مشروع للتعاون أو مجرد سؤال.
            </p>

            <div className="space-y-4">
              <ContactInfo icon={<Mail size={16} />}    label="البريد الإلكتروني" value={profile.email} />
              <ContactInfo icon={<MapPin size={16} />}  label="الموقع"            value={profile.location} />
            </div>
          </div>

          {/* Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="الاسم"
                placeholder="اسمك الكريم"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">الرسالة</label>
                <textarea
                  rows={4}
                  placeholder="اكتب رسالتك هنا..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none transition-colors"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Send size={16} />
                {sent ? '✅ تم الإرسال!' : 'إرسال الرسالة'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}

const ContactInfo = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) =>
  value ? (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-primary-400">{icon}</span>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-slate-300">{value}</p>
      </div>
    </div>
  ) : null
