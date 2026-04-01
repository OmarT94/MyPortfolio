import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store'
import type { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: UserRole
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/',
}: ProtectedRouteProps) => {
  const { role } = useAuthStore()

  if (role !== requiredRole) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
