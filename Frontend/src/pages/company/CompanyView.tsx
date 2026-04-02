import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout'
import { PageSpinner } from '../../components/ui'
import { useProfileStore, useAuthStore } from '../../store'
import { CompanyHeader } from './CompanyHeader'
import { CompanyTabs }   from './CompanyTabs'

export const CompanyView = () => {
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const { companyProfile, isLoading, fetchCompany } = useProfileStore()

  // حماية — فقط COMPANY يمكنه الوصول
  useEffect(() => {
    if (role !== 'COMPANY') {
      navigate('/', { replace: true })
      return
    }
    fetchCompany()
  }, [role, navigate, fetchCompany])

  if (isLoading || !companyProfile) return <PageSpinner />

  return (
    <Layout>
      {/* Banner خاص بالشركة */}
      <div className="bg-primary-600/10 border-b border-primary-500/20 py-2 px-4 text-center">
        <p className="text-xs text-primary-300">
          🔐 أنت تشاهد الملف الشخصي الكامل — هذه الصفحة خاصة بك
        </p>
      </div>

      <CompanyHeader profile={companyProfile} />
      <CompanyTabs   profile={companyProfile} />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} {companyProfile.fullName}</p>
      </footer>
    </Layout>
  )
}
