import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../api'
import { useAuthStore } from '../../store'
import { PageSpinner } from '../../components/ui'
import { useI18nStore } from '../../i18n'


// هذه الصفحة تعمل كـ Gate:
// 1. تأخذ الـ token من الرابط
// 2. تتحقق منه مع الـ Backend
// 3. إذا صحيح → تحفظ JWT وتنتقل لـ CompanyView
// 4. إذا خطأ → تعرض رسالة خطأ

export const CompanyGate = () => {
    const { token } = useParams<{ token: string }>()
    const navigate = useNavigate()
    const { setCompanyAuth } = useAuthStore()
    const [error, setError] = useState<string | null>(null)
    const { setLanguage } = useI18nStore()

    useEffect(() => {
        if (!token) {
            setError('رابط غير صالح')
            return
        }

        authApi.companyLogin({ token })
            .then((res) => {
                if (res.valid && res.accessToken) {
                    if (res.language) setLanguage(res.language as 'ar' | 'en' | 'de')

                    //  Magic Token speichern — für useVisitTracker
                    sessionStorage.setItem('magic-token', token)


                    setCompanyAuth(res.accessToken, res.companyName)
                    navigate('/company/view', { replace: true })
                } else {
                    setError('هذا الرابط غير صالح أو انتهت صلاحيته')
                }
            })
            .catch(() => setError('حدث خطأ — يرجى المحاولة مرة أخرى'))
    }, [token, navigate, setCompanyAuth])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <div className="text-6xl">🔒</div>
                    <h1 className="text-2xl font-bold text-slate-100">رابط غير صالح</h1>
                    <p className="text-slate-400 max-w-sm">{error}</p>
                    <p className="text-slate-600 text-sm">
                        إذا كنت تعتقد أن هذا خطأ، تواصل مع صاحب الملف الشخصي
                    </p>
                </div>
            </div>
        )
    }

    return <PageSpinner />
}
