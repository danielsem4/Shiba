import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'

export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}
