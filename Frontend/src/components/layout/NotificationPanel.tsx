import { Bell, X, Check } from 'lucide-react'
import { useNotificationStore } from '../../store'

export const NotificationPanel = () => {
  const { notifications, isOpen, closePanel, markAllRead } = useNotificationStore()

  if (!isOpen) return null

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ar-SA', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: 'short',
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={closePanel} />

      {/* Panel */}
      <div className="fixed top-20 right-4 z-50 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <Bell size={16} className="text-primary-400" />
            الإشعارات
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              title="تعليم الكل كمقروء"
            >
              <Check size={15} />
            </button>
            <button
              onClick={closePanel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              لا توجد إشعارات
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 text-sm transition-colors ${
                  n.read ? 'text-slate-500' : 'text-slate-200 bg-primary-500/5'
                }`}
              >
                <p>{n.message}</p>
                <p className="text-xs text-slate-600 mt-1">{formatTime(n.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
