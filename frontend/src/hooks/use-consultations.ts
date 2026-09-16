import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { ConsultationMedicale } from '@/types'

export const consultationKeys = {
  all: ['consultations'] as const,
  list: () => [...consultationKeys.all, 'list'] as const,
  detail: (id: number) => [...consultationKeys.all, 'detail', id] as const,
}

export function useConsultations() {
  return useQuery<ConsultationMedicale[]>({
    queryKey: consultationKeys.list(),
    queryFn: () => api.get(endpoints.consultations.list),
  })
}

export function useConsultation(id: number) {
  return useQuery<ConsultationMedicale>({
    queryKey: consultationKeys.detail(id),
    queryFn: () => api.get(endpoints.consultations.detail(id)),
    enabled: !!id,
  })
}

export function useCreateConsultation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ConsultationMedicale>) => api.post(endpoints.consultations.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: consultationKeys.all }),
  })
}

export function useUpdateConsultation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ConsultationMedicale> }) =>
      api.put(endpoints.consultations.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: consultationKeys.all }),
  })
}
