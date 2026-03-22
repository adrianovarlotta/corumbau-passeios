'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button-link'
import { Calendar, Clock, Users, Flame, Tag } from 'lucide-react'

// ─── Featured tours (specific dates, admin-highlighted) ─────────────────────
const FEATURED_TOURS = [
  {
    id: 'f1',
    name: 'Mergulho nos Corais',
    slug: 'mergulho-corais',
    category: 'BOAT' as const,
    price: 220,
    originalPrice: null as number | null,       // null = no discount
    description: 'Explore os recifes de corais de Corumbau com snorkel e mergulho guiado.',
    image: '/images/mergulho-corais.jpg',
    date: 'Dom, 22 Mar',
    time: '09:00',
    spotsLeft: 6,
    totalSpots: 12,
    tourDateId: 'feat-1',
  },
  {
    id: 'f2',
    name: 'Baleia Jubarte — Manhã',
    slug: 'baleia-jubarte',
    category: 'WHALE' as const,
    price: 199,
    originalPrice: 250,                         // Was R$250, now R$199
    description: 'Saída matinal para observação de baleias na região de Abrolhos.',
    image: '/images/baleia-jubarte.jpg',
    date: 'Seg, 23 Mar',
    time: '07:30',
    spotsLeft: 4,
    totalSpots: 20,
    tourDateId: 'feat-2',
  },
  {
    id: 'f3',
    name: 'Baleia Jubarte — Tarde',
    slug: 'baleia-jubarte',
    category: 'WHALE' as const,
    price: 250,
    originalPrice: null,
    description: 'Passeio ao pôr do sol com chances de ver baleias e golfinhos.',
    image: '/images/baleia-jubarte.jpg',
    date: 'Seg, 23 Mar',
    time: '14:00',
    spotsLeft: 12,
    totalSpots: 20,
    tourDateId: 'feat-3',
  },
]

// ─── Regular tour catalog ───────────────────────────────────────────────────
const MOCK_TOURS = [
  {
    id: '1',
    name: 'Baleia Jubarte',
    slug: 'baleia-jubarte',
    category: 'WHALE' as const,
    price: 250,
    description: 'Observe as majestosas baleias jubarte em seu habitat natural nas águas de Abrolhos.',
    duration: '4 horas',
    image: '/images/baleia-jubarte.jpg',
  },
  {
    id: '5',
    name: 'Mergulho nos Corais',
    slug: 'mergulho-corais',
    category: 'BOAT' as const,
    price: 220,
    description: 'Explore os recifes de corais de Corumbau com snorkel e mergulho guiado.',
    duration: '3 horas',
    image: '/images/mergulho-corais.jpg',
  },
  {
    id: '2',
    name: 'Barco Praia do Espelho',
    slug: 'barco-espelho',
    category: 'BOAT' as const,
    price: 180,
    description: 'Navegue até a praia mais bonita da Bahia com paradas para mergulho.',
    duration: '6 horas',
    image: '/images/barco-espelho.jpg',
  },
  {
    id: '3',
    name: 'Buggy Costa das Baleias',
    slug: 'buggy-costa',
    category: 'BUGGY' as const,
    price: 320,
    description: 'Explore praias desertas e cenários únicos no litoral sul da Bahia.',
    duration: 'Dia inteiro',
    image: '/images/buggy-costa.jpg',
  },
  {
    id: '4',
    name: 'Vivência com Pescadores',
    slug: 'vivencia-pescadores',
    category: 'EXPERIENCE' as const,
    price: 150,
    description: 'Viva um dia na rotina dos pescadores artesanais de Corumbau.',
    duration: '3 horas',
    image: '/images/vivencia-pescadores.jpg',
  },
  {
    id: '6',
    name: 'Aldeia Porto do Boi',
    slug: 'aldeia-porto-do-boi',
    category: 'EXPERIENCE' as const,
    price: 180,
    description: 'Visite a aldeia Pataxó no encontro do rio com o mar. Dança Awê, pintura corporal, artesanato e culinária indígena.',
    duration: '4 horas',
    image: '/images/aldeia-porto-do-boi.jpg',
  },
  {
    id: '7',
    name: 'Aldeia Pará-Cura',
    slug: 'aldeia-para-cura',
    category: 'EXPERIENCE' as const,
    price: 200,
    description: 'Vivência ritualística Pataxó com banho de ervas, defumação, cantos sagrados e conexão com a natureza.',
    duration: '3 horas',
    image: '/images/aldeia-para-cura.jpg',
  },
]

const CATEGORIES = [
  { value: 'ALL', label: 'Todos' },
  { value: 'WHALE', label: '🐋 Baleias' },
  { value: 'BOAT', label: '⛵ Barcos' },
  { value: 'BUGGY', label: '🏖️ Buggy' },
  { value: 'EXPERIENCE', label: '✨ Vivências' },
]

// ─── Featured Tour Card ─────────────────────────────────────────────────────
function FeaturedCard({ tour }: { tour: typeof FEATURED_TOURS[0] }) {
  const spotsPercentage = ((tour.totalSpots - tour.spotsLeft) / tour.totalSpots) * 100
  const isAlmostFull = tour.spotsLeft <= 4
  const hasDiscount = tour.originalPrice !== null && tour.originalPrice > tour.price
  const discountPercent = hasDiscount
    ? Math.round(((tour.originalPrice! - tour.price) / tour.originalPrice!) * 100)
    : 0

  return (
    <div className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image with gradient overlay */}
      <div className="relative h-36 w-full">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="object-cover"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Date badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-primary" />
          <span className="text-xs font-semibold text-primary">{tour.date}</span>
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-full px-2.5 py-0.5 flex items-center gap-1 shadow-md">
            <Tag className="h-3 w-3" />
            <span className="text-[10px] font-bold">-{discountPercent}%</span>
          </div>
        )}

        {/* Hot badge if almost full (only when no discount badge) */}
        {isAlmostFull && !hasDiscount && (
          <div className="absolute top-2.5 right-2.5 bg-red-500 text-white rounded-full px-2 py-0.5 flex items-center gap-1">
            <Flame className="h-3 w-3" />
            <span className="text-[10px] font-bold">Últimas vagas</span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <h3 className="font-display text-base font-bold text-white leading-tight drop-shadow-md">
            {tour.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {tour.time}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {tour.spotsLeft} vagas
          </span>
          {isAlmostFull && hasDiscount && (
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <Flame className="h-3 w-3" />
              Últimas!
            </span>
          )}
        </div>

        {/* Capacity bar */}
        <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isAlmostFull ? 'bg-red-400' : 'bg-emerald-400'
            )}
            style={{ width: `${spotsPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-primary">
              R$ {tour.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {tour.originalPrice}
              </span>
            )}
            <span className="text-xs font-normal text-muted-foreground">/pessoa</span>
          </div>
          <ButtonLink
            href={`/passeios/${tour.slug}?tourDateId=${tour.tourDateId}`}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-amber-500 font-semibold text-xs px-4"
          >
            Reservar
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

// ─── Main Content ───────────────────────────────────────────────────────────
function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || 'ALL'

  const filtered = category === 'ALL'
    ? MOCK_TOURS
    : MOCK_TOURS.filter(t => t.category === category)

  function handleCategoryChange(value: string) {
    if (value === 'ALL') {
      router.push('/')
    } else {
      router.push(`/?category=${value}`)
    }
  }

  return (
    <div className="pb-8 pt-4">
      {/* ── Featured Section ── */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-red-500" />
          <h2 className="font-display text-lg font-bold text-primary">
            Próximas saídas
          </h2>
        </div>
      </div>

      {/* Horizontal scroll featured cards */}
      <div className="-mx-0 px-4 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
          {FEATURED_TOURS.map(tour => (
            <FeaturedCard key={tour.id} tour={tour} />
          ))}
          {/* End spacer for scroll */}
          <div className="w-1 flex-shrink-0" />
        </div>
      </div>

      {/* ── All Tours Section ── */}
      <div className="px-4">
        <h2 className="font-display text-lg font-bold text-primary mb-4">
          Todos os passeios
        </h2>

        {/* Category filter pills */}
        <div className="-mx-4 px-4 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  category === cat.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tour list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🏖️</p>
            <p className="font-display text-xl font-bold text-primary">Nenhum passeio disponível</p>
            <p className="text-muted-foreground text-sm mt-1">Em breve teremos novidades nesta categoria.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
            {filtered.map(tour => (
              <div
                key={tour.id}
                className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                  <div>
                    <h2 className="font-display text-base font-bold text-primary leading-tight truncate">
                      {tour.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-display text-lg font-bold text-primary">
                      R$ {tour.price}
                      <span className="text-xs font-normal text-muted-foreground">/pessoa</span>
                    </span>
                    <ButtonLink
                      href={`/passeios/${tour.slug}`}
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-amber-500 font-semibold text-xs px-4"
                    >
                      Reservar
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="pb-8 pt-4">
      {/* Featured skeleton */}
      <div className="px-4 mb-3">
        <div className="h-6 w-40 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="px-4 mb-8">
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-36 bg-muted animate-pulse" />
              <div className="p-3.5 space-y-2">
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                <div className="h-1.5 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog skeleton */}
      <div className="px-4">
        <div className="h-6 w-36 bg-muted rounded-lg mb-4 animate-pulse" />
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-9 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm">
              <div className="w-24 h-24 bg-muted rounded-xl animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
                <div className="h-6 w-20 bg-muted rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  )
}
