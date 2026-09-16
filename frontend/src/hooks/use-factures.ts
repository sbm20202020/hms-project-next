import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Facture } from '@/types'

export const factureKeys = {
  all: ['factures'] as const,
  list: () => [...factureKeys.all, 'list'] as const,
  detail: (id: number) => [...factureKeys.all, 'detail', id] as const,
}

export function useFactures() {
  return useQuery<Facture[]>({
    queryKey: factureKeys.list(),
    queryFn: () => api.get(endpoints.factures.list),
  })
}

export function useFacture(id: number) {
  return useQuery<Facture>({
    queryKey: factureKeys.detail(id),
    queryFn: () => api.get(endpoints.factures.detail(id)),
    enabled: !!id,
  })
}

export function useCreateFacture() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Facture>) => api.post(endpoints.factures.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: factureKeys.all }),
  })
}

export function useUpdateFacture() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Facture> }) =>
      api.put(endpoints.factures.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: factureKeys.all }),
  })
}
