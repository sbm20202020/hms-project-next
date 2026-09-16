import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { ExamenImagerie } from '@/types'

export const imagerieKeys = {
  all: ['imagerie'] as const,
  list: () => [...imagerieKeys.all, 'list'] as const,
  detail: (id: number) => [...imagerieKeys.all, 'detail', id] as const,
}

export function useExamensImagerie() {
  return useQuery<ExamenImagerie[]>({
    queryKey: imagerieKeys.list(),
    queryFn: () => api.get(endpoints.imagerie.list),
  })
}

export function useCreateExamenImagerie() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamenImagerie>) => api.post(endpoints.imagerie.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: imagerieKeys.all }),
  })
}

export function useUpdateExamenImagerie() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExamenImagerie> }) =>
      api.put(endpoints.imagerie.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: imagerieKeys.all }),
  })
}
