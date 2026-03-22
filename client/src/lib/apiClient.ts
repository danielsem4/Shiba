import axios from 'axios'
import { getToken, clearTokenFromInterceptor } from '@/features/auth/context/AuthContext'

export const apiClient = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearTokenFromInterceptor()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
