'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TourCardSkeleton } from '@/components/tour/TourCard'

const MOCK_TOURS = [
  { id: '1', name: 'Passeio Baleia Jubarte', slug: 'baleia-jubarte', category: 'WHALE' as const, priceAdult: 250, duration: '4 horas', image: '/images/baleia-jubarte.jpg', isActive: true },
  { id: '2', name: 'Passeio de Barco à Praia do Espelho', slug: 'barco-espelho', category: 'BOAT' as const, priceAdult: 180, duration: '6 horas', image: '/images/barco-espelho.jpg', isActive: true },
  { id: '3', name: 'Buggy Costa das Baleias', slug: 'buggy-costa', category: 'BUGGY' as const, priceAdult: 320, duration: 'Dia inteiro', image: '/images/buggy-costa.jpg', isActive: true },
  { id: '4', name: 'Vivência com Pescadores', slug: 'vivencia-pescadores', category: 'EXPERIENCE' as const, priceAdult: 150, duration: '3 horas', image: '/images/vivencia-pescadores.jpg', isActive: true },
]

const CATEGORIES = [
  { value: 'ALL', label: 'Todos' },
  { value: 'WHALE', label: '🐋 Baleias' },
  { value: 'BOAT', label: '⛵ Barcos' },
  { value: 'BUGGY', label: '🏖️ Buggy' },
  { value: 'EXPERIENCE', label: '✨ Vivências' },
]

const CATEGORY_BADGES: Record<string, { label: string; color: string }> = {
  WHALE: { label: 'Baleia Jubarte', color: 'bg-blue-900/10 text-blue-900' },
  BOAT: { label: 'Barco', color: 'bg-cyan-600/10 text-cyan-700' },
  BUGGY: { label: 'Buggy', color: 'bg-amber-700/10 text-amber-800' },
  EXPERIENCE: { label: 'Vivência', color: 'bg-violet-600/10 text-violet-700' },
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'ALL'

  const filtered = category === 'ALL'
    ? MOCK_TOURS
    : MOCK_TOURS.filter(t => t.category === category)

  return (
    <div className="container px-4 py-12">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">Catálogo</p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary tracking-tight">Nossos Passeios</h1>
        <p className="text-muted-foreground text-lg mt-3">Escolha sua próxima aventura no Corumbau</p>
      </div>

      <Tabs defaultValue={category} className="mb-10">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid bg-white shadow-sm">
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value}>
              <a href={cat.value === 'ALL' ? '/passeios' : `/passeios?category=${cat.value}`}>
                {cat.label}
              </a>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏖️</p>
          <p className="font-display text-2xl font-bold text-primary">Nenhum passeio disponível</p>
          <p className="text-muted-foreground mt-2">Os passeios desta categoria serão publicados em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(tour => {
            const badge = CATEGORY_BADGES[tour.category]
            return (
              <a
                key={tour.id}
                href={`/passeios/${tour.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>
                  <h3 className="font-display text-xl font-bold mt-2 text-primary group-hover:text-sky-700 transition-colors">
                    {tour.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-muted-foreground text-sm">{tour.duration}</span>
                    <span className="font-display text-xl font-bold text-primary">
                      R$ {tour.priceAdult.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <TourCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
