'use client'

import { useState } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Plus, Pencil, CalendarDays } from 'lucide-react'

type TourCategory = 'WHALE' | 'BOAT' | 'BUGGY' | 'EXPERIENCE'

interface Tour {
  id: string
  name: string
  category: TourCategory
  priceAdult: number
  isActive: boolean
  slug: string
}

const CATEGORY_LABELS: Record<TourCategory, string> = {
  WHALE: 'Baleia',
  BOAT: 'Barco',
  BUGGY: 'Buggy',
  EXPERIENCE: 'Experiencia',
}

const CATEGORY_COLORS: Record<TourCategory, string> = {
  WHALE: 'bg-blue-100 text-blue-800 border-0',
  BOAT: 'bg-cyan-100 text-cyan-800 border-0',
  BUGGY: 'bg-amber-100 text-amber-800 border-0',
  EXPERIENCE: 'bg-purple-100 text-purple-800 border-0',
}

const MOCK_TOURS: Tour[] = [
  { id: '1', name: 'Passeio de Barco Corumbau', category: 'BOAT', priceAdult: 180, isActive: true, slug: 'passeio-barco-corumbau' },
  { id: '2', name: 'Avistamento de Baleias', category: 'WHALE', priceAdult: 250, isActive: true, slug: 'avistamento-baleias' },
  { id: '3', name: 'Buggy ate Caraiva', category: 'BUGGY', priceAdult: 150, isActive: true, slug: 'buggy-caraiva' },
  { id: '4', name: 'Mergulho nos Recifes', category: 'EXPERIENCE', priceAdult: 320, isActive: false, slug: 'mergulho-recifes' },
  { id: '5', name: 'Passeio ao Monte Pascoal', category: 'EXPERIENCE', priceAdult: 200, isActive: true, slug: 'monte-pascoal' },
]

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS)

  function handleToggleActive(tourId: string) {
    setTours((prev) =>
      prev.map((t) => (t.id === tourId ? { ...t, isActive: !t.isActive } : t))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Passeios</h1>
          <p className="text-muted-foreground">Gerencie seus passeios e atividades</p>
        </div>
        <ButtonLink href="/admin/tours/new">
          <Plus className="h-4 w-4 mr-2" />
          Novo Passeio
        </ButtonLink>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preco Adulto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell className="font-medium">{tour.name}</TableCell>
                <TableCell>
                  <Badge variant="default" className={CATEGORY_COLORS[tour.category]}>
                    {CATEGORY_LABELS[tour.category]}
                  </Badge>
                </TableCell>
                <TableCell>R$ {tour.priceAdult.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tour.isActive}
                      onCheckedChange={() => handleToggleActive(tour.id)}
                    />
                    <span className={cn('text-sm', tour.isActive ? 'text-emerald-600' : 'text-muted-foreground')}>
                      {tour.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ButtonLink href={`/admin/tours/new?edit=${tour.id}`} variant="outline" size="sm">
                      <Pencil className="h-3 w-3 mr-1" />
                      Editar
                    </ButtonLink>
                    <ButtonLink href={`/admin/tours/${tour.id}/dates`} variant="outline" size="sm">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      Gerenciar Datas
                    </ButtonLink>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
