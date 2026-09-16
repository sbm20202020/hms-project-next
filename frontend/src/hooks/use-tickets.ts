import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Ticket } from '@/types'

export const ticketKeys = {
  all: ['tickets'] as const,
  list: () => [...ticketKeys.all, 'list'] as const,
}

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ticketKeys.list(),
    queryFn: () => api.get(endpoints.hospital.tickets),
  })
}

export function useUpdateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ticket> }) =>
      api.put(endpoints.hospital.ticketDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ticketKeys.all }),
  })
}
