import { Navbar } from './Navbar'
import { NotificationPanel } from './NotificationPanel'
import { useAuthStore } from '../../store'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { role } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      {role === 'ADMIN' && <NotificationPanel />}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
