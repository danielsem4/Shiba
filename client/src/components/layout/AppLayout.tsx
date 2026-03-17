import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function AppLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — placeholder for future navigation */}
      <aside className="hidden w-64 border-r border-border bg-card md:block">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground">{t('appName')}</h2>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header — placeholder for future top bar */}
        <header className="flex h-14 items-center border-b border-border bg-card px-6">
          <span className="text-sm text-muted-foreground">{t('nav.dashboard')}</span>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
