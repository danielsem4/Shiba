import { useAuthStore } from '@/features/auth/stores/authStore'

export function useIsAdmin() {
  const user = useAuthStore((state) => state.user)
  return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
}
