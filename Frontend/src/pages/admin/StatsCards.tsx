import { Building2, Eye, BellRing, TrendingUp } from 'lucide-react'
import type { Company, Visit } from '../../types'

interface StatsCardsProps {
  companies: Company[]
  unreadCount: number
  visits: Visit[]
}

export const StatsCards = ({ companies, unreadCount, visits }: StatsCardsProps) => {
  const totalVisits = visits.length
  const activeLinks = companies.filter((c) => c.active).length

  const cards = [
    {
      label: 'الشركات المسجّلة',
      value: companies.length,
      icon:  Building2,
      color: 'text-primary-400',
      bg:    'bg-primary-500/10',
    },
    {
      label: 'الروابط النشطة',
      value: activeLinks,
      icon:  TrendingUp,
      color: 'text-emerald-400',
      bg:    'bg-emerald-500/10',
    },
    {
      label: 'إجمالي الزيارات',
      value: totalVisits,
      icon:  Eye,
      color: 'text-amber-400',
      bg:    'bg-amber-500/10',
    },
    {
      label: 'إشعارات جديدة',
      value: unreadCount,
      icon:  BellRing,
      color: 'text-rose-400',
      bg:    'bg-rose-500/10',
    },
  ]

  return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm">{label}</span>
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
        ))}
      </div>
  )
}
