import { useState } from 'react'
import { Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '../../components/ui'
import type { Visit } from '../../types'

interface VisitsTableProps {
    visits: Visit[]
}

export const VisitsTable = ({ visits }: VisitsTableProps) => {

    const [expandedCompany, setExpandedCompany] = useState<string | null>(null)

    // ─── Besuche nach Firma gruppieren ───────────────────────────────────────
    const grouped = visits.reduce((acc, visit) => {
        const key = visit.companyName
        if (!acc[key]) acc[key] = []
        acc[key].push(visit)
        return acc
    }, {} as Record<string, Visit[]>)

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit',
            hour: '2-digit', minute: '2-digit',
        })

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return '—'
        if (seconds < 60)  return `${seconds} ث`
        if (seconds < 3600) return `${Math.floor(seconds / 60)} Min`
        return `${Math.floor(seconds / 3600)} Std`
    }

    const formatLastVisit = (dateStr: string) => {
        const date = new Date(dateStr)
        const now  = new Date()
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60)
        if (diff < 1)  return 'gerade eben'
        if (diff < 24) return `vor ${diff} Stunden`
        const days = Math.floor(diff / 24)
        if (days === 1) return 'gestern'
        return `vor ${days} Tagen`
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl">

            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-800">
                <Eye size={18} className="text-primary-400" />
                <h2 className="text-lg font-semibold text-slate-100">سجل الزيارات</h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full mr-auto">
          {visits.length} زيارة
        </span>
            </div>

            {/* Grouped List */}
            <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto">
                {Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-12 text-slate-600 text-sm">
                        لا توجد زيارات بعد
                    </div>
                ) : (
                    Object.entries(grouped).map(([companyName, companyVisits]) => {
                        const isExpanded   = expandedCompany === companyName
                        const lastVisit    = companyVisits[0]  // bereits nach Datum sortiert
                        const totalMinutes = Math.floor(
                            companyVisits.reduce((sum, v) => sum + v.durationSeconds, 0) / 60
                        )

                        return (
                            <div key={companyName}>

                                {/* ─── Company Row (eingeklappt) ──────────────────────────── */}
                                <div
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors cursor-pointer"
                                    onClick={() => setExpandedCompany(isExpanded ? null : companyName)}
                                >
                                    {/* Icon */}
                                    <div className="p-2 bg-primary-500/10 rounded-lg shrink-0">
                                        <Eye size={14} className="text-primary-400" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-200 text-sm">{companyName}</p>
                                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {companyVisits.length} Besuche
                      </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">
                        letzte: {formatLastVisit(lastVisit.timestamp)}
                      </span>
                                            {totalMinutes > 0 && (
                                                <span className="text-xs text-slate-600 flex items-center gap-1">
                          <Clock size={10} /> {totalMinutes} Min gesamt
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Toggle Button */}
                                    <button className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 shrink-0 transition-colors">
                                        {isExpanded ? (
                                            <><ChevronUp size={14} /> Einklappen</>
                                        ) : (
                                            <><ChevronDown size={14} /> Details anzeigen</>
                                        )}
                                    </button>
                                </div>

                                {/* ─── Details (ausgeklappt) ──────────────────────────────── */}
                                {isExpanded && (
                                    <div className="bg-slate-950/50 border-t border-slate-800/50 divide-y divide-slate-800/30">
                                        {companyVisits.map((visit, index) => (
                                            <div key={visit.id} className="flex items-start gap-4 px-8 py-3">

                                                {/* Index */}
                                                <span className="text-xs text-slate-600 shrink-0 w-4 mt-0.5">
                          {index + 1}.
                        </span>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-slate-400">
                              📅 {formatTime(visit.timestamp)}
                            </span>
                                                        <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Clock size={10} /> {formatDuration(visit.durationSeconds)}
                            </span>
                                                    </div>

                                                    {/* Pages */}
                                                    <div className="flex flex-wrap gap-1">
                                                        {visit.pagesViewed.map((page) => (
                                                            <Badge key={page} variant="info">{page}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
