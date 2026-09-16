import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { RendezVous } from '@/types'

export const rdvKeys = {
  all: ['rdv'] as const,
  list: () => [...rdvKeys.all, 'list'] as const,
  detail: (id: number) => [...rdvKeys.all, 'detail', id] as const,
}

export function useRendezVous() {
  return useQuery<RendezVous[]>({
    queryKey: rdvKeys.list(),
    queryFn: () => api.get(endpoints.rdv.list),
  })
}

export function useCreateRendezVous() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<RendezVous>) => api.post(endpoints.rdv.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: rdvKeys.all }),
  })
}

export function useUpdateRendezVous() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RendezVous> }) =>
      api.put(endpoints.rdv.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: rdvKeys.all }),
  })
}

export function useDeleteRendezVous() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(endpoints.rdv.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: rdvKeys.all }),
  })
}
