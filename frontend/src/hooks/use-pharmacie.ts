import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Medicament, Ordonnance } from '@/types'

export const pharmacieKeys = {
  all: ['pharmacie'] as const,
  medicaments: () => [...pharmacieKeys.all, 'medicaments'] as const,
  medicament: (id: number) => [...pharmacieKeys.all, 'medicament', id] as const,
  ordonnances: () => [...pharmacieKeys.all, 'ordonnances'] as const,
  ordonnance: (id: number) => [...pharmacieKeys.all, 'ordonnance', id] as const,
}

export function useMedicaments() {
  return useQuery<Medicament[]>({
    queryKey: pharmacieKeys.medicaments(),
    queryFn: () => api.get(endpoints.pharmacie.medicaments),
  })
}

export function useCreateMedicament() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Medicament>) => api.post(endpoints.pharmacie.medicaments, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: pharmacieKeys.medicaments() }),
  })
}

export function useUpdateMedicament() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Medicament> }) =>
      api.put(endpoints.pharmacie.medicamentDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: pharmacieKeys.medicaments() }),
  })
}

export function useOrdonnances() {
  return useQuery<Ordonnance[]>({
    queryKey: pharmacieKeys.ordonnances(),
    queryFn: () => api.get(endpoints.pharmacie.ordonnances),
  })
}

export function useCreateOrdonnance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Ordonnance>) => api.post(endpoints.pharmacie.ordonnances, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: pharmacieKeys.ordonnances() }),
  })
}
