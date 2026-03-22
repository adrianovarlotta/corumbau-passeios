'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { KPICard } from '@/components/admin/KPICard'
import { DollarSign, Users, TrendingUp, Percent } from 'lucide-react'

export default function AdminReportsPage() {
  const [dateFrom, setDateFrom] = useState('2026-03-01')
  const [dateTo, setDateTo] = useState('2026-03-21')

  // Mock KPI data
  const kpis = {
    revenue: 47800,
    bookings: 312,
    occupancyRate: 78,
    commissionTotal: 4780,
  }

  // Mock chart data
  const chartData = [
    { label: '01/03', value: 2400 },
    { label: '05/03', value: 3200 },
    { label: '10/03', value: 2800 },
    { label: '15/03', value: 4100 },
    { label: '20/03', value: 3600 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatorios</h1>
        <p className="text-muted-foreground">Visao geral do desempenho da operacao</p>
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-from">De</Label>
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-to">Ate</Label>
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Faturamento"
          value={`R$ ${kpis.revenue.toFixed(2).replace('.', ',')}`}
          trend="up"
          trendValue="+15%"
          description="vs. periodo anterior"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Reservas"
          value={String(kpis.bookings)}
          trend="up"
          trendValue="+23"
          description="vs. periodo anterior"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Taxa de Ocupacao"
          value={`${kpis.occupancyRate}%`}
          trend="up"
          trendValue="+5%"
          description="vs. periodo anterior"
          icon={<Percent className="h-4 w-4" />}
        />
        <KPICard
          title="Total Comissoes"
          value={`R$ ${kpis.commissionTotal.toFixed(2).replace('.', ',')}`}
          trend="down"
          trendValue="-3%"
          description="vs. periodo anterior"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-6">Faturamento no Periodo</h2>
          <div className="flex items-end gap-3 h-48">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  R$ {(d.value / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all"
                  style={{ height: `${(d.value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Detalhamento por Passeio</h2>
          <div className="space-y-3">
            {[
              { name: 'Passeio de Barco Corumbau', bookings: 98, revenue: 17640, occupancy: 82 },
              { name: 'Avistamento de Baleias', bookings: 72, revenue: 18000, occupancy: 90 },
              { name: 'Buggy ate Caraiva', bookings: 85, revenue: 7650, occupancy: 71 },
              { name: 'Mergulho nos Recifes', bookings: 42, revenue: 4200, occupancy: 65 },
              { name: 'Monte Pascoal', bookings: 15, revenue: 310, occupancy: 50 },
            ].map((tour) => (
              <div key={tour.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{tour.name}</p>
                  <p className="text-xs text-muted-foreground">{tour.bookings} reservas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">R$ {tour.revenue.toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs text-muted-foreground">{tour.occupancy}% ocupacao</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
