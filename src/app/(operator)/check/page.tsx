'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ButtonLink } from '@/components/ui/button-link'
import { EmbarkCounter } from '@/components/checkin/EmbarkCounter'
import { CheckinRow } from '@/components/checkin/CheckinRow'
import { QrCode, Search } from 'lucide-react'

// Mock data — will be replaced with TanStack Query (V9)
const MOCK_MANIFEST = [
  { id: '1', customerName: 'João Silva', adults: 2, children: 1, voucherCode: 'HK7W3P', checkedIn: true },
  { id: '2', customerName: 'Maria Santos', adults: 3, children: 0, voucherCode: 'AB3K9R', checkedIn: false },
  { id: '3', customerName: 'Pedro Oliveira', adults: 1, children: 0, voucherCode: 'FG5T2N', checkedIn: false },
  { id: '4', customerName: 'Ana Costa e família', adults: 4, children: 2, voucherCode: 'LM8Y4D', checkedIn: false },
]

export default function ManifestPage() {
  const [search, setSearch] = useState('')
  const [manualCode, setManualCode] = useState('')

  const totalPassengers = MOCK_MANIFEST.reduce((sum, p) => sum + p.adults + p.children, 0)
  const checkedPassengers = MOCK_MANIFEST.filter(p => p.checkedIn).reduce((sum, p) => sum + p.adults + p.children, 0)

  const filtered = search
    ? MOCK_MANIFEST.filter(p => p.customerName.toLowerCase().includes(search.toLowerCase()))
    : MOCK_MANIFEST

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-primary">Corumbau Passeios</h1>
        <p className="text-sm text-muted-foreground">Manifest de Embarque</p>
      </div>

      {/* Tour selector placeholder */}
      <div className="rounded-lg border p-3 bg-card">
        <p className="text-sm font-medium">Baleia Jubarte — 06:00</p>
        <p className="text-xs text-muted-foreground">Hoje, {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Embark counter */}
      <EmbarkCounter checked={checkedPassengers} total={totalPassengers} />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href="/check/scan" className="w-full">
          <QrCode className="h-4 w-4 mr-2" /> Escanear
        </ButtonLink>
        <div className="flex gap-2">
          <Input
            placeholder="Código..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            className="font-mono uppercase"
            maxLength={6}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar passageiro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Passenger list */}
      <div className="space-y-2">
        {filtered.map(passenger => (
          <CheckinRow
            key={passenger.id}
            customerName={passenger.customerName}
            adults={passenger.adults}
            childCount={passenger.children}
            voucherCode={passenger.voucherCode}
            checkedIn={passenger.checkedIn}
          />
        ))}
      </div>
    </div>
  )
}
