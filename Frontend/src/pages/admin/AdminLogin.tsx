import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { authApi } from '../../api'
import { useAuthStore } from '../../store'
import { Button, Input, Card } from '../../components/ui'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const { setAdminAuth } = useAuthStore()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.adminLogin(form)
      setAdminAuth(res.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (e) {
      console.log('Error:', e)
      setError('بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600/10 border border-primary-500/20 rounded-2xl mb-4">
            <Lock size={24} className="text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">لوحة التحكم</h1>
          <p className="text-slate-500 text-sm mt-1">تسجيل دخول المشرف</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="اسم المستخدم"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <Input
              label="كلمة السر"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              <User size={16} />
              دخول
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
