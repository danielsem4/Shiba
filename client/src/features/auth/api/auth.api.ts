import { apiClient } from '@/lib/apiClient'
import type { LoginFormData } from '../schemas/auth.schema'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data)
  return response.data
}
