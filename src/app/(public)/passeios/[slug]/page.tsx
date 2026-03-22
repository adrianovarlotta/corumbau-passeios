import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ButtonLink } from '@/components/ui/button-link'
import { TourCategoryBadge } from '@/components/tour/TourCategoryBadge'
import { SlotsWarning } from '@/components/ui/SlotsWarning'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import { Clock, Users, CheckCircle, CalendarDays } from 'lucide-react'

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

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // TODO: Fetch from API with TanStack Query — for now use mock data
  const tour = MOCK_TOUR.slug === slug ? MOCK_TOUR : MOCK_TOUR

  const hasDates = tour.tourDates.length > 0

  return (
    <div className="container px-4 py-8">
      {/* Hero Image */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl mb-8">
        <Image
          src={tour.images[0]}
          alt={tour.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Category */}
          <div>
            <TourCategoryBadge category={tour.category} className="mb-3" />
            <h1 className="text-3xl lg:text-4xl font-bold">{tour.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {tour.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Até {tour.maxCapacity} pessoas
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Sobre o passeio</h2>
            <p className="text-muted-foreground leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="text-xl font-semibold mb-3">O que está incluso</h2>
            <ul className="space-y-2">
              {tour.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar — Pricing & Dates */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">A partir de</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(tour.priceAdult)}
              </p>
              <p className="text-sm text-muted-foreground">por adulto</p>
              {tour.priceChild != null && tour.priceChild > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Criança: {formatCurrency(tour.priceChild)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Available Dates */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Datas Disponíveis
            </h2>

            {!hasDates ? (
              <EmptyState
                title="Sem datas disponíveis"
                description="Novas datas serão publicadas em breve. Fique de olho!"
              />
            ) : (
              <div className="space-y-3">
                {tour.tourDates.map((td) => {
                  const available = td.totalSlots - td.bookedSlots
                  const isFull = available <= 0

                  return (
                    <Card key={td.id} className={cn(isFull && 'opacity-60')}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{formatDate(td.date)}</p>
                            <p className="text-sm text-muted-foreground">
                              {td.time}h
                            </p>
                          </div>
                          <Badge variant={isFull ? 'secondary' : 'outline'}>
                            {isFull
                              ? 'Esgotado'
                              : `${available} vaga${available > 1 ? 's' : ''}`}
                          </Badge>
                        </div>

                        {!isFull && available <= 5 && (
                          <SlotsWarning available={available} />
                        )}

                        {isFull ? (
                          <p className="text-sm text-center text-muted-foreground">
                            Todas as vagas preenchidas
                          </p>
                        ) : (
                          <ButtonLink
                            href={`/passeios/${tour.slug}/checkout?tourDateId=${td.id}`}
                            className="w-full"
                          >
                            Reservar
                          </ButtonLink>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
