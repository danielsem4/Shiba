import { createContext, useState, useCallback, useEffect } from 'react'
import type { AuthUser } from '../types/auth.types'

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

let tokenAccessor: () => string | null = () => null
let clearAuthAccessor: () => void = () => {}

export function getToken(): string | null {
  return tokenAccessor()
}

export function clearTokenFromInterceptor(): void {
  clearAuthAccessor()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken)
    setUser(newUser)
  }, [])

  const clearAuth = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    tokenAccessor = () => token
    clearAuthAccessor = clearAuth
  }, [token, clearAuth])

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: token !== null,
    setAuth,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
