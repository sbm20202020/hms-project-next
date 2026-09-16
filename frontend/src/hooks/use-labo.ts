import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { ExamenLabo } from '@/types'

export const laboKeys = {
  all: ['labo'] as const,
  list: () => [...laboKeys.all, 'list'] as const,
  detail: (id: number) => [...laboKeys.all, 'detail', id] as const,
}

export function useExamensLabo() {
  return useQuery<ExamenLabo[]>({
    queryKey: laboKeys.list(),
    queryFn: () => api.get(endpoints.labo.list),
  })
}

export function useCreateExamenLabo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExamenLabo>) => api.post(endpoints.labo.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: laboKeys.all }),
  })
}

export function useUpdateExamenLabo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExamenLabo> }) =>
      api.put(endpoints.labo.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: laboKeys.all }),
  })
}
