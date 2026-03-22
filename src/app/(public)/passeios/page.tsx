'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TourCardSkeleton } from '@/components/tour/TourCard'

// Placeholder for TanStack Query integration (V2)
const MOCK_TOURS = [
  { id: '1', name: 'Passeio Baleia Jubarte', slug: 'baleia-jubarte', category: 'WHALE' as const, priceAdult: 250, duration: '4 horas', images: ['https://placehold.co/600x400/1E40AF/FFFFFF?text=Baleia+Jubarte'], isActive: true },
  { id: '2', name: 'Passeio de Barco ao Espelho', slug: 'barco-espelho', category: 'BOAT' as const, priceAdult: 180, duration: '6 horas', images: ['https://placehold.co/600x400/0891B2/FFFFFF?text=Barco'], isActive: true },
  { id: '3', name: 'Buggy Costa das Baleias', slug: 'buggy-costa', category: 'BUGGY' as const, priceAdult: 320, duration: 'Dia inteiro', images: ['https://placehold.co/600x400/B45309/FFFFFF?text=Buggy'], isActive: true },
  { id: '4', name: 'Vivência com Pescadores', slug: 'vivencia-pescadores', category: 'EXPERIENCE' as const, priceAdult: 150, duration: '3 horas', images: ['https://placehold.co/600x400/7C3AED/FFFFFF?text=Vivência'], isActive: true },
]

const CATEGORIES = [
  { value: 'ALL', label: 'Todos' },
  { value: 'WHALE', label: '🐋 Baleias' },
  { value: 'BOAT', label: '⛵ Barcos' },
  { value: 'BUGGY', label: '🏖️ Buggy' },
  { value: 'EXPERIENCE', label: '✨ Vivências' },
]

function CatalogContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'ALL'

  const filtered = category === 'ALL'
    ? MOCK_TOURS
    : MOCK_TOURS.filter(t => t.category === category)

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Nossos Passeios</h1>
      <p className="text-muted-foreground mb-6">Escolha sua próxima aventura no Corumbau</p>

      <Tabs defaultValue={category} className="mb-8">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
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
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🏖️</p>
          <p className="text-lg font-semibold">Nenhum passeio disponível</p>
          <p className="text-muted-foreground">Os passeios desta categoria serão publicados em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tour => (
            <a key={tour.id} href={`/passeios/${tour.slug}`} className="block">
              <div className="group cursor-pointer overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tour.images[0]}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary">{tour.category}</span>
                  <h3 className="font-semibold text-lg mt-1">{tour.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-muted-foreground text-sm">{tour.duration}</span>
                    <span className="font-bold text-primary">
                      R$ {tour.priceAdult.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <TourCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
