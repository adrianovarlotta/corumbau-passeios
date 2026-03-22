import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'
import { TourCategoryBadge } from '@/components/tour/TourCategoryBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { BackButton } from '@/components/navigation/BackButton'
import { cn } from '@/lib/utils'
import { Clock, Users, CheckCircle, CalendarDays, MapPin, AlertTriangle } from 'lucide-react'

// TODO: Replace with TanStack Query hook (useQuery + fetch from /api/tours/[slug])
const MOCK_TOUR = {
  id: 'clx1234567890',
  name: 'Passeio Baleia Jubarte',
  slug: 'baleia-jubarte',
  description:
    'Embarque em uma experiência inesquecível de avistamento de baleias jubarte no litoral sul da Bahia. Navegue pelas águas cristalinas do Parque Nacional Marinho de Abrolhos e observe de perto o espetáculo das baleias em seu habitat natural. Nossos guias especializados garantem uma experiência segura e educativa para toda a família.',
  duration: '4 horas',
  category: 'WHALE' as const,
  priceAdult: 250,
  priceChild: 150,
  maxCapacity: 20,
  images: ['/images/baleia-jubarte.jpg'],
  includes: [
    'Transporte marítimo ida e volta',
    'Guia especializado bilíngue',
    'Colete salva-vidas',
    'Seguro marítimo',
    'Água e frutas a bordo',
  ],
  isActive: true,
  tourDates: [
    {
      id: 'td1',
      date: '2026-03-25T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 12,
      status: 'OPEN' as const,
    },
    {
      id: 'td2',
      date: '2026-03-25T00:00:00Z',
      time: '14:00',
      totalSlots: 20,
      bookedSlots: 18,
      status: 'OPEN' as const,
    },
    {
      id: 'td3',
      date: '2026-03-26T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 5,
      status: 'OPEN' as const,
    },
    {
      id: 'td4',
      date: '2026-03-27T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 0,
      status: 'OPEN' as const,
    },
  ],
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

// Group dates by day for better visual
function groupDatesByDay(dates: typeof MOCK_TOUR.tourDates) {
  const groups: Record<string, typeof dates> = {}
  dates.forEach(td => {
    const key = td.date.split('T')[0]
    if (!groups[key]) groups[key] = []
    groups[key].push(td)
  })
  return Object.entries(groups)
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // TODO: Fetch from API with TanStack Query — for now use mock data
  const tour = MOCK_TOUR.slug === slug ? MOCK_TOUR : MOCK_TOUR

  const hasDates = tour.tourDates.length > 0
  const groupedDates = groupDatesByDay(tour.tourDates)

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <BackButton href="/" label="Voltar aos passeios" className="mb-4" />

      {/* ── Hero: Mobile = stacked, Desktop = side by side ── */}
      <div className="flex flex-col lg:flex-row lg:gap-8 mb-8">
        {/* Image — contained on desktop */}
        <div className="relative aspect-[4/3] lg:aspect-[3/2] w-full lg:w-1/2 overflow-hidden rounded-2xl flex-shrink-0">
          <Image
            src={tour.images[0]}
            alt={tour.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info — alongside image on desktop */}
        <div className="mt-5 lg:mt-0 lg:flex lg:flex-col lg:justify-center space-y-4">
          <TourCategoryBadge category={tour.category} />
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-primary leading-tight">
            {tour.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Até {tour.maxCapacity} pessoas
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              Corumbau, BA
            </span>
          </div>

          {/* Price highlight */}
          <div className="bg-primary/5 rounded-xl p-4 mt-2">
            <p className="text-xs text-muted-foreground mb-0.5">A partir de</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-primary">
                {formatCurrency(tour.priceAdult)}
              </span>
              <span className="text-sm text-muted-foreground">/ adulto</span>
            </div>
            {tour.priceChild != null && tour.priceChild > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Criança (até 11 anos): {formatCurrency(tour.priceChild)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Description + Includes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-display text-lg font-bold text-primary mb-3">Sobre o passeio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tour.description}
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-primary mb-3">O que está incluso</h2>
          <ul className="space-y-2">
            {tour.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Available Dates ── */}
      <div>
        <h2 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Escolha sua data
        </h2>

        {!hasDates ? (
          <EmptyState
            title="Sem datas disponíveis"
            description="Novas datas serão publicadas em breve. Fique de olho!"
          />
        ) : (
          <div className="space-y-4">
            {groupedDates.map(([dayKey, dates]) => (
              <div key={dayKey}>
                {/* Day header */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {formatDate(dates[0].date)}
                </p>

                {/* Time slots for this day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dates.map((td) => {
                    const available = td.totalSlots - td.bookedSlots
                    const isFull = available <= 0
                    const isLow = !isFull && available <= 5
                    const occupancy = Math.round((td.bookedSlots / td.totalSlots) * 100)

                    return (
                      <div
                        key={td.id}
                        className={cn(
                          'rounded-2xl border p-4 transition-all',
                          isFull
                            ? 'bg-muted/50 opacity-60 border-border'
                            : 'bg-white border-border hover:border-accent hover:shadow-md',
                        )}
                      >
                        {/* Time + Slots row */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-display text-xl font-bold text-primary">
                              {td.time}h
                            </span>
                          </div>
                          <Badge variant={isFull ? 'secondary' : 'outline'} className="text-xs">
                            {isFull
                              ? 'Esgotado'
                              : `${available} vaga${available > 1 ? 's' : ''}`}
                          </Badge>
                        </div>

                        {/* Occupancy bar */}
                        <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              isFull ? 'bg-muted-foreground/30' :
                              isLow ? 'bg-red-400' : 'bg-emerald-400'
                            )}
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>

                        {/* Warning or CTA */}
                        {isLow && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mb-2">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Últimas {available} vagas!
                          </div>
                        )}

                        {isFull ? (
                          <p className="text-xs text-center text-muted-foreground py-1">
                            Todas as vagas preenchidas
                          </p>
                        ) : (
                          <ButtonLink
                            href={`/passeios/${tour.slug}/checkout?tourDateId=${td.id}`}
                            className="w-full bg-accent text-accent-foreground hover:bg-amber-500 font-semibold"
                            size="sm"
                          >
                            Reservar
                          </ButtonLink>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
