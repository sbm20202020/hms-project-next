import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { SoinInfirmier } from '@/types'

export const soinsKeys = {
  all: ['soins'] as const,
  list: () => [...soinsKeys.all, 'list'] as const,
}

export function useSoinsInfirmiers() {
  return useQuery<SoinInfirmier[]>({
    queryKey: soinsKeys.list(),
    queryFn: () => api.get(endpoints.soins.list),
  })
}

export function useCreateSoinInfirmier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SoinInfirmier>) => api.post(endpoints.soins.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: soinsKeys.all }),
  })
}
