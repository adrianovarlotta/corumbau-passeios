'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button-link'
import { ArrowLeft, Clock, Users, ChevronRight } from 'lucide-react'

interface TourDateOption {
  id: string
  tourName: string
  category: string
  time: string
  bookedSlots: number
  totalSlots: number
}

// Mock data — will be replaced with TanStack Query
const MOCK_TODAY_TOURS: TourDateOption[] = [
  {
    id: 'td-1',
    tourName: 'Avistamento de Baleias',
    category: 'WHALE',
    time: '06:00',
    bookedSlots: 12,
    totalSlots: 16,
  },
  {
    id: 'td-2',
    tourName: 'Passeio de Lancha — Recife de Corumbau',
    category: 'BOAT',
    time: '09:00',
    bookedSlots: 8,
    totalSlots: 10,
  },
  {
    id: 'td-3',
    tourName: 'Buggy até Caraíva',
    category: 'BUGGY',
    time: '08:30',
    bookedSlots: 4,
    totalSlots: 6,
  },
  {
    id: 'td-4',
    tourName: 'Passeio de Lancha — Recife de Corumbau',
    category: 'BOAT',
    time: '14:00',
    bookedSlots: 3,
    totalSlots: 10,
  },
]

const categoryLabels: Record<string, string> = {
  WHALE: 'Baleia',
  BOAT: 'Lancha',
  BUGGY: 'Buggy',
  EXPERIENCE: 'Experiência',
}

export default function TourSelectPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  function handleSelect(tourDateId: string) {
    setSelectedId(tourDateId)
    router.push(`/check?tourDateId=${tourDateId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ButtonLink href="/check" variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </ButtonLink>
        <div>
          <h1 className="text-lg font-bold text-primary">Selecionar Passeio</h1>
          <p className="text-sm text-muted-foreground capitalize">{today}</p>
        </div>
      </div>

      {/* Tour list */}
      <div className="space-y-3">
        {MOCK_TODAY_TOURS.map((tour) => {
          const occupancyPercent = Math.round(
            (tour.bookedSlots / tour.totalSlots) * 100
          )
          const isFull = tour.bookedSlots >= tour.totalSlots

          return (
            <button
              key={tour.id}
              onClick={() => handleSelect(tour.id)}
              disabled={selectedId === tour.id}
              className={cn(
                'w-full rounded-lg border p-4 text-left transition-colors',
                'hover:border-primary/50 hover:bg-accent',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selectedId === tour.id && 'border-primary bg-accent'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {categoryLabels[tour.category] || tour.category}
                    </span>
                  </div>
                  <p className="font-medium">{tour.tourName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {tour.time}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1',
                        isFull && 'text-destructive'
                      )}
                    >
                      <Users className="h-3.5 w-3.5" />
                      {tour.bookedSlots}/{tour.totalSlots}
                    </span>
                  </div>
                  {/* Occupancy bar */}
                  <div className="h-1.5 w-full rounded-full bg-secondary mt-2">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        occupancyPercent >= 90
                          ? 'bg-destructive'
                          : occupancyPercent >= 70
                            ? 'bg-amber-500'
                            : 'bg-primary'
                      )}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-3" />
              </div>
            </button>
          )
        })}
      </div>

      {MOCK_TODAY_TOURS.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">Nenhum passeio agendado para hoje</p>
        </div>
      )}
    </div>
  )
}
