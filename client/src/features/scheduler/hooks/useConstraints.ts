import { useQuery } from '@tanstack/react-query'
import { fetchConstraints } from '../api/scheduler.api'

export function useConstraints(year: number | null) {
  return useQuery({
    queryKey: ['scheduler', 'constraints', year],
    queryFn: () => fetchConstraints(year!),
    enabled: !!year,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
