'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateCard } from '@/components/admin/DateCard'
import { ButtonLink } from '@/components/ui/button-link'
import { ArrowLeft, Plus } from 'lucide-react'

type DateStatus = 'OPEN' | 'FULL' | 'CANCELLED'

interface TourDate {
  id: string
  date: string
  time: string
  totalSlots: number
  bookedSlots: number
  status: DateStatus
  cancelReason?: string
}

const MOCK_TOUR_NAME = 'Passeio de Barco Corumbau'

const MOCK_DATES: TourDate[] = [
  { id: 'd1', date: '25/03/2026', time: '08:00', totalSlots: 20, bookedSlots: 14, status: 'OPEN' },
  { id: 'd2', date: '26/03/2026', time: '08:00', totalSlots: 20, bookedSlots: 20, status: 'FULL' },
  { id: 'd3', date: '27/03/2026', time: '08:00', totalSlots: 20, bookedSlots: 5, status: 'OPEN' },
  { id: 'd4', date: '28/03/2026', time: '14:00', totalSlots: 15, bookedSlots: 0, status: 'CANCELLED', cancelReason: 'Mau tempo' },
  { id: 'd5', date: '29/03/2026', time: '08:00', totalSlots: 20, bookedSlots: 0, status: 'OPEN' },
  { id: 'd6', date: '30/03/2026', time: '08:00', totalSlots: 20, bookedSlots: 8, status: 'OPEN' },
]

export default function AdminTourDatesPage() {
  const params = useParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tourId = params.tourId as string // TODO: use with TanStack Query

  const [dates, setDates] = useState<TourDate[]>(MOCK_DATES)
  const [newDateOpen, setNewDateOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  // New date form
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newSlots, setNewSlots] = useState('')

  function handleAddDate() {
    if (!newDate || !newTime || !newSlots) return

    const formatted = new Date(newDate).toLocaleDateString('pt-BR')
    const date: TourDate = {
      id: `d${Date.now()}`,
      date: formatted,
      time: newTime,
      totalSlots: parseInt(newSlots),
      bookedSlots: 0,
      status: 'OPEN',
    }

    setDates((prev) => [...prev, date])
    setNewDate('')
    setNewTime('')
    setNewSlots('')
    setNewDateOpen(false)
  }

  function handleOpenCancel(dateId: string) {
    setCancelTarget(dateId)
    setCancelReason('')
    setCustomReason('')
    setCancelOpen(true)
  }

  function handleConfirmCancel() {
    if (!cancelTarget || !cancelReason) return

    const reason = cancelReason === 'Outro' ? customReason || 'Outro' : cancelReason

    setDates((prev) =>
      prev.map((d) =>
        d.id === cancelTarget
          ? { ...d, status: 'CANCELLED' as const, cancelReason: reason }
          : d
      )
    )
    setCancelOpen(false)
    setCancelTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink href="/admin/tours" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </ButtonLink>
        <div>
          <h1 className="text-2xl font-bold">{MOCK_TOUR_NAME}</h1>
          <p className="text-muted-foreground">Gerenciar datas e vagas</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{dates.length} datas cadastradas</p>
        <Dialog open={newDateOpen} onOpenChange={setNewDateOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">Data</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-time">Horario</Label>
                <Input
                  id="new-time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-slots">Total de Vagas</Label>
                <Input
                  id="new-slots"
                  type="number"
                  value={newSlots}
                  onChange={(e) => setNewSlots(e.target.value)}
                  placeholder="Ex: 20"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddDate}>Adicionar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((d) => (
          <DateCard
            key={d.id}
            date={d.date}
            time={d.time}
            totalSlots={d.totalSlots}
            bookedSlots={d.bookedSlots}
            status={d.status}
            cancelReason={d.cancelReason}
            onViewManifest={() => {}}
            onCancel={() => handleOpenCancel(d.id)}
          />
        ))}
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Motivo do Cancelamento</Label>
              <Select value={cancelReason} onValueChange={(v) => setCancelReason(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mau tempo">Mau tempo</SelectItem>
                  <SelectItem value="Embarcacao indisponivel">Embarcacao indisponivel</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {cancelReason === 'Outro' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Motivo personalizado</Label>
                <Input
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Descreva o motivo..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancelOpen(false)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={handleConfirmCancel}>
                Confirmar Cancelamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
