import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CheckoutFormData, BookingManifest } from '@/types'

async function createBooking(data: CheckoutFormData) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erro ao criar reserva')
  }
  return res.json()
}

async function fetchManifest(tourDateId: string): Promise<BookingManifest[]> {
  const res = await fetch(`/api/operator/manifest?tourDateId=${tourDateId}`)
  if (!res.ok) throw new Error('Erro ao buscar manifesto')
  const json = await res.json()
  return json.data
}

async function checkinVoucher(voucherCode: string) {
  const res = await fetch('/api/operator/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voucherCode }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erro no check-in')
  }
  return res.json()
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  })
}

export function useManifest(tourDateId: string) {
  return useQuery({
    queryKey: ['manifest', tourDateId],
    queryFn: () => fetchManifest(tourDateId),
    enabled: !!tourDateId,
    refetchInterval: 10_000, // Auto-refresh every 10s for live check-in
  })
}

export function useCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: checkinVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifest'] })
    },
  })
}
