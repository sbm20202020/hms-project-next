import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Service } from '@/types'

export const serviceKeys = {
  all: ['services'] as const,
  list: () => [...serviceKeys.all, 'list'] as const,
  detail: (id: number) => [...serviceKeys.all, 'detail', id] as const,
}

export function useServices() {
  return useQuery<Service[]>({
    queryKey: serviceKeys.list(),
    queryFn: () => api.get(endpoints.hospital.services),
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Service>) => api.post(endpoints.hospital.servicesCrud, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Service> }) =>
      api.put(endpoints.hospital.serviceDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}
