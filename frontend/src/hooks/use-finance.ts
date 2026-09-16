import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Depense, FinanceDashboard } from '@/types'

export const financeKeys = {
  all: ['finance'] as const,
  dashboard: () => [...financeKeys.all, 'dashboard'] as const,
  depenses: () => [...financeKeys.all, 'depenses'] as const,
  revenus: () => [...financeKeys.all, 'revenus'] as const,
}

export function useFinanceDashboard() {
  return useQuery<FinanceDashboard>({
    queryKey: financeKeys.dashboard(),
    queryFn: () => api.get(endpoints.finance.dashboard),
  })
}

export function useDepenses() {
  return useQuery<Depense[]>({
    queryKey: financeKeys.depenses(),
    queryFn: () => api.get(endpoints.finance.depenses),
  })
}

export function useCreateDepense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Depense>) => api.post(endpoints.finance.depenses, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: financeKeys.all }),
  })
}

export function useRevenus() {
  return useQuery({
    queryKey: financeKeys.revenus(),
    queryFn: () => api.get(endpoints.finance.revenus),
  })
}
