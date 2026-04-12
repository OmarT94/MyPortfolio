import { useEffect, useRef, useState } from 'react'
import { useAuthStore, useCompanyStore, useVisitStore, useNotificationStore } from '../../store'
import { Layout } from '../../components/layout'
import { StatsCards } from './StatsCards'
import { CompanyTable } from './CompanyTable'
import { VisitsTable } from './VisitsTable'
import { LayoutDashboard, UserCog, Briefcase } from 'lucide-react'
import { ProfileEditor } from './ProfileEditor'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useT } from '../../i18n'
import { JobApplicationsTab } from './JobApplicationsTab'

export const AdminDashboard = () => {
  const token       = useAuthStore((state) => state.token)
  const companies   = useCompanyStore((state) => state.companies)
  const visits      = useVisitStore((state) => state.visits)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const fetched     = useRef(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { t } = useT()
  useWebSocket()

  useEffect(() => {
    if (fetched.current || !token) return
    fetched.current = true
    useCompanyStore.getState().fetchAll()
    useVisitStore.getState().fetchAll()
    useVisitStore.getState().fetchStats()
    useNotificationStore.getState().fetchUnreadCount()
    useNotificationStore.getState().fetchAll()
  }, [token])

  if (!token) return <div style={{ color: 'white' }}>No token!</div>

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

          {/* Header + Tabs */}
          <div className="flex items-center justify-between">
            <div>
              <h1>{t('admin.dashboard')}</h1>
              <p>{t('admin.subtitle')}</p>
            </div>

            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {[
                { id: 'dashboard',   label: t('admin.dashboard'),   icon: LayoutDashboard },
                { id: 'profile',     label: t('admin.editProfile'), icon: UserCog         },
                { id: 'bewerbungen', label: 'Bewerbungen',          icon: Briefcase       },
              ].map(({ id, label, icon: Icon }) => (
                  <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeTab === id ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Icon size={15} /> {label}
                  </button>
              ))}
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
              <>
                {/* ← stats entfernt, visits hinzugefügt */}
                <StatsCards companies={companies} unreadCount={unreadCount} visits={visits} />
                <div className="grid lg:grid-cols-2 gap-6">
                  <CompanyTable />
                  <VisitsTable visits={visits} />
                </div>
              </>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && <ProfileEditor />}

          {/* Bewerbungen Tab */}
          {activeTab === 'bewerbungen' && <JobApplicationsTab />}

        </div>
      </Layout>
  )
}
