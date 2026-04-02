import { Clock, Eye } from 'lucide-react'
import { Badge } from '../../components/ui'
import type { Visit } from '../../types'

interface VisitsTableProps {
  visits: Visit[]
}

export const VisitsTable = ({ visits }: VisitsTableProps) => {
  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('ar-SA', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: 'short',
    })

  const formatDuration = (seconds: number) => {
    if (seconds < 60)  return `${seconds} ث`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} د`
    return `${Math.floor(seconds / 3600)} س`
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-3 p-5 border-b border-slate-800">
        <Eye size={18} className="text-primary-400" />
        <h2 className="text-lg font-semibold text-slate-100">سجل الزيارات</h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full mr-auto">
          {visits.length} زيارة
        </span>
      </div>

      <div className="divide-y divide-slate-800/50 max-h-96 overflow-y-auto">
        {visits.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-sm">
            لا توجد زيارات بعد
          </div>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">

              {/* Icon */}
              <div className="p-2 bg-primary-500/10 rounded-lg shrink-0 mt-0.5">
                <Eye size={14} className="text-primary-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-200 text-sm">{visit.companyName}</p>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock size={11} /> {formatDuration(visit.durationSeconds)}
                  </span>
                </div>

                {/* Pages viewed */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {visit.pagesViewed.map((page) => (
                    <Badge key={page} variant="info">{page}</Badge>
                  ))}
                </div>
              </div>

              {/* Time */}
              <p className="text-xs text-slate-600 shrink-0">{formatTime(visit.timestamp)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
