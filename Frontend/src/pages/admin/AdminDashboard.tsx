import { useEffect, useRef } from 'react'
import { useAuthStore, useCompanyStore, useVisitStore, useNotificationStore } from '../../store'
import { Layout } from '../../components/layout'
import { StatsCards } from './StatsCards'
import { CompanyTable } from './CompanyTable'
import { VisitsTable } from './VisitsTable'

export const AdminDashboard = () => {
  const token    = useAuthStore((state) => state.token)
  const companies  = useCompanyStore((state) => state.companies)
  const visits     = useVisitStore((state) => state.visits)
  const stats      = useVisitStore((state) => state.stats)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const fetched  = useRef(false)

  useEffect(() => {
    if (fetched.current || !token) return
    fetched.current = true
    console.log('Fetching...')
    useCompanyStore.getState().fetchAll().then(() => {
      console.log('companies after fetch:', useCompanyStore.getState().companies)
    })
  }, [token])

  useEffect(() => {
    if (fetched.current || !token) return
    fetched.current = true
    useCompanyStore.getState().fetchAll()
    useVisitStore.getState().fetchAll()
    useVisitStore.getState().fetchStats()
    useNotificationStore.getState().fetchUnreadCount()
  }, [token])

  if (!token) return <div style={{color:'white'}}>No token!</div>

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">لوحة التحكم</h1>
            <p className="text-slate-500 text-sm mt-1">مرحباً — إليك ملخص نشاط ملفك الشخصي</p>
          </div>
          <StatsCards companies={companies} stats={stats} unreadCount={unreadCount} />
          <div className="grid lg:grid-cols-2 gap-6">
            <CompanyTable />
            <VisitsTable visits={visits} />
          </div>
        </div>
      </Layout>
  )
}