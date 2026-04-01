import { Bell, LogOut, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '../../store'

export const Navbar = () => {
  const navigate = useNavigate()
  const { role, logout } = useAuthStore()
  const { unreadCount, togglePanel } = useNotificationStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <span className="text-lg font-bold text-slate-100 cursor-pointer" onClick={() => navigate('/')}>
          {'<Portfolio />'}
        </span>

        {/* Admin Actions */}
        {role === 'ADMIN' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            {/* Notification Bell */}
            <button
              onClick={togglePanel}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
