import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Chambre, Admission } from '@/types'

export const hospitalisationKeys = {
  all: ['hospitalisation'] as const,
  chambres: () => [...hospitalisationKeys.all, 'chambres'] as const,
  chambre: (id: number) => [...hospitalisationKeys.all, 'chambre', id] as const,
  admissions: () => [...hospitalisationKeys.all, 'admissions'] as const,
  admission: (id: number) => [...hospitalisationKeys.all, 'admission', id] as const,
}

export function useChambres() {
  return useQuery<Chambre[]>({
    queryKey: hospitalisationKeys.chambres(),
    queryFn: () => api.get(endpoints.chambres.list),
  })
}

export function useCreateChambre() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Chambre>) => api.post(endpoints.chambres.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hospitalisationKeys.chambres() }),
  })
}

export function useAdmissions() {
  return useQuery<Admission[]>({
    queryKey: hospitalisationKeys.admissions(),
    queryFn: () => api.get(endpoints.admissions.list),
  })
}

export function useCreateAdmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Admission>) => api.post(endpoints.admissions.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hospitalisationKeys.admissions() }),
  })
}

export function useUpdateAdmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Admission> }) =>
      api.put(endpoints.admissions.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: hospitalisationKeys.admissions() }),
  })
}
