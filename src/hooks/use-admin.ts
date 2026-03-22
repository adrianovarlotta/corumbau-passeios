import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Admin Tours
async function fetchAdminTours() {
  const res = await fetch('/api/admin/tours')
  if (!res.ok) throw new Error('Erro ao buscar passeios')
  return (await res.json()).data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createTour(data: any) {
  const res = await fetch('/api/admin/tours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erro ao criar passeio')
  }
  return (await res.json()).data
}

// Admin Tour Dates
async function fetchTourDates(tourId: string) {
  const res = await fetch(`/api/admin/tour-dates?tourId=${tourId}`)
  if (!res.ok) throw new Error('Erro ao buscar datas')
  return (await res.json()).data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createTourDate(data: any) {
  const res = await fetch('/api/admin/tour-dates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erro ao criar data')
  }
  return (await res.json()).data
}

// Admin Commissions
async function fetchCommissions(status?: string) {
  const params = status ? `?status=${status}` : ''
  const res = await fetch(`/api/admin/commissions${params}`)
  if (!res.ok) throw new Error('Erro ao buscar comissões')
  return (await res.json()).data
}

async function markCommissionsPaid(ids: string[]) {
  const res = await fetch('/api/admin/commissions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar comissões')
  return (await res.json()).data
}

// Admin Bookings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createOfflineBooking(data: any) {
  const res = await fetch('/api/admin/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erro ao criar reserva')
  }
  return (await res.json()).data
}

// Hooks
export function useAdminTours() {
  return useQuery({ queryKey: ['admin', 'tours'], queryFn: fetchAdminTours })
}

export function useCreateTour() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTour,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tours'] }),
  })
}

export function useTourDates(tourId: string) {
  return useQuery({
    queryKey: ['admin', 'tour-dates', tourId],
    queryFn: () => fetchTourDates(tourId),
    enabled: !!tourId,
  })
}

export function useCreateTourDate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTourDate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tour-dates'] }),
  })
}

export function useCommissions(status?: string) {
  return useQuery({
    queryKey: ['admin', 'commissions', status],
    queryFn: () => fetchCommissions(status),
  })
}

export function useMarkCommissionsPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markCommissionsPaid,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'commissions'] }),
  })
}

export function useCreateOfflineBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createOfflineBooking,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin'] }),
  })
}
