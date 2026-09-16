import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Employe } from '@/types'

export const employeKeys = {
  all: ['employes'] as const,
  list: () => [...employeKeys.all, 'list'] as const,
  detail: (id: number) => [...employeKeys.all, 'detail', id] as const,
}

export function useEmployes() {
  return useQuery<Employe[]>({
    queryKey: employeKeys.list(),
    queryFn: () => api.get(endpoints.employes.list),
  })
}

export function useCreateEmploye() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Employe>) => api.post(endpoints.employes.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeKeys.all }),
  })
}

export function useUpdateEmploye() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employe> }) =>
      api.put(endpoints.employes.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeKeys.all }),
  })
}
