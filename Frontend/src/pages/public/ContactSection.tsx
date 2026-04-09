import { useState } from 'react'
import { Mail, Send, MapPin } from 'lucide-react'
import { Button, Input, Card } from '../../components/ui'
import type { PublicProfile } from '../../types'
import { useT } from '../../i18n'
import { AnimatedSection } from '../../components/ui/AnimatedSection'
import emailjs from '@emailjs/browser'

interface ContactSectionProps {
  profile: PublicProfile
}

export const ContactSection = ({ profile }: ContactSectionProps) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const { t } = useT()
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: form.name,
            email: form.email,
            message: form.message,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  return (
      <section id="contact" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">

          <AnimatedSection direction="up">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Mail size={20} className="text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100">{t('contact.title')}</h2>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-10">

            <AnimatedSection direction="left" delay={0.2}>
              <div className="space-y-6">
                <p className="text-slate-400 leading-relaxed">{t('contact.subtitle')}</p>
                <div className="space-y-4">
                  <ContactInfo icon={<Mail size={16} />}   label={t('contact.email')}    value={profile.email} />
                  <ContactInfo icon={<MapPin size={16} />} label={t('contact.location')} value={profile.location} />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.3}>
              <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                      label={t('contact.name')}
                      placeholder={t('contact.placeholder.name')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                  />
                  <Input
                      label={t('contact.email')}
                      type="email"
                      placeholder={t('contact.placeholder.email')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">{t('contact.message')}</label>
                    <textarea
                        rows={4}
                        placeholder={t('contact.placeholder.message')}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none transition-colors"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" isLoading={sending}>
                    <Send size={16} />
                    {sent ? `✅ ${t('contact.sent')}` : t('contact.send')}
                  </Button>
                </form>
              </Card>
            </AnimatedSection>

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