import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { DossierPatient, CountResponse } from '@/types'

export const dossierKeys = {
  all: ['dossiers'] as const,
  list: () => [...dossierKeys.all, 'list'] as const,
  today: () => [...dossierKeys.all, 'today'] as const,
  yesterday: () => [...dossierKeys.all, 'yesterday'] as const,
  count: () => [...dossierKeys.all, 'count'] as const,
  byDate: (date: string) => [...dossierKeys.all, 'date', date] as const,
  detail: (id: number) => [...dossierKeys.all, 'detail', id] as const,
}

export function useDossiers() {
  return useQuery<DossierPatient[]>({
    queryKey: dossierKeys.list(),
    queryFn: () => api.get(endpoints.dossiers.list),
  })
}

export function useDossiersToday() {
  return useQuery<DossierPatient[]>({
    queryKey: dossierKeys.today(),
    queryFn: () => api.get(endpoints.dossiers.today),
  })
}

export function useDossiersYesterday() {
  return useQuery<DossierPatient[]>({
    queryKey: dossierKeys.yesterday(),
    queryFn: () => api.get(endpoints.dossiers.yesterday),
  })
}

export function useDossiersCount() {
  return useQuery<CountResponse>({
    queryKey: dossierKeys.count(),
    queryFn: () => api.get(endpoints.dossiers.count),
  })
}

export function useDossiersByDate(date: string) {
  return useQuery<DossierPatient[]>({
    queryKey: dossierKeys.byDate(date),
    queryFn: () => api.get(endpoints.dossiers.byDate(date)),
    enabled: !!date,
  })
}

export function useCreateDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<DossierPatient>) => api.post(endpoints.dossiers.list, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dossierKeys.all })
    },
  })
}

export function useUpdateDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DossierPatient> }) =>
      api.put(endpoints.dossiers.detail(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dossierKeys.all })
    },
  })
}
