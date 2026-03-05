import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { loginUser } from '../api/auth.api'
import { useAuthStore } from '../stores/authStore'
import type { LoginFormData } from '../schemas/auth.schema'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginFormData) => loginUser(data),
    onSuccess: (response) => {
      setAuth(response.token, response.user)
      toast.success('Welcome back!')
      navigate('/home')
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Invalid credentials. Please try again.'
      toast.error(message)
    },
  })
}
