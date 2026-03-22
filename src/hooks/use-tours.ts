import { useQuery } from '@tanstack/react-query'
import type { TourWithDates } from '@/types'

async function fetchTours(category?: string): Promise<TourWithDates[]> {
  const params = new URLSearchParams()
  if (category && category !== 'ALL') params.set('category', category)
  const res = await fetch(`/api/tours?${params}`)
  if (!res.ok) throw new Error('Erro ao buscar passeios')
  const json = await res.json()
  return json.data
}

async function fetchTourBySlug(slug: string): Promise<TourWithDates> {
  const res = await fetch(`/api/tours/${slug}`)
  if (!res.ok) throw new Error('Passeio não encontrado')
  const json = await res.json()
  return json.data
}

export function useTours(category?: string) {
  return useQuery({
    queryKey: ['tours', category],
    queryFn: () => fetchTours(category),
  })
}

export function useTour(slug: string) {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn: () => fetchTourBySlug(slug),
    enabled: !!slug,
  })
}
