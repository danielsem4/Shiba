import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Home,
  CalendarDays,
  ShieldCheck,
  BarChart3,
  Settings,
  Users,
} from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/features/auth'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import type { NavItem } from '@/components/layout/Sidebar'

export function AppLayout() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const baseNavItems: NavItem[] = [
    { label: t('nav.home'), path: '/home', icon: Home },
    { label: t('nav.assignments'), path: '/assignments', icon: CalendarDays },
    { label: t('nav.constraints'), path: '/constraints', icon: ShieldCheck },
    { label: t('nav.statistics'), path: '/statistics', icon: BarChart3 },
    { label: t('nav.settings'), path: '/settings', icon: Settings },
  ]

  const isAdmin = useIsAdmin()

  const navItems: NavItem[] = isAdmin
    ? [
        ...baseNavItems.slice(0, 4),
        { label: t('nav.coordinators'), path: '/coordinators', icon: Users },
        ...baseNavItems.slice(4),
      ]
    : baseNavItems

  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={navItems} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border bg-card px-6">
          <span className="text-sm font-medium text-foreground">
            {user?.name ?? ''}
          </span>
        </header>

        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
