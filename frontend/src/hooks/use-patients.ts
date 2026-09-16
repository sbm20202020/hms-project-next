import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Patient, CountResponse } from '@/types'

export const patientKeys = {
  all: ['patients'] as const,
  list: () => [...patientKeys.all, 'list'] as const,
  count: () => [...patientKeys.all, 'count'] as const,
  detail: (id: number) => [...patientKeys.all, 'detail', id] as const,
}

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: patientKeys.list(),
    queryFn: () => api.get(endpoints.patients.list),
  })
}

export function usePatientsCount() {
  return useQuery<CountResponse>({
    queryKey: patientKeys.count(),
    queryFn: () => api.get(endpoints.patients.count),
  })
}

export function useCreatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Patient>) => api.post(endpoints.patients.list, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all })
    },
  })
}
