import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/stores/authStore'

function App() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold text-slate-900">
        Welcome back{user?.name ? `, ${user.name}` : ''}!
      </h1>
      <p className="text-slate-500 text-sm">You are signed in to the Shiba system.</p>
      <Button variant="outline" onClick={handleLogout} className="mt-4 gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </main>
  )
}

export default App
