'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KPICard } from '@/components/admin/KPICard'
import { DollarSign, Users, TrendingUp, Percent } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Visão geral do desempenho da operação</p>
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
          <Label htmlFor="date-to">Até</Label>
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
          value={`R$ ${kpis.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend="up"
          trendValue="+15%"
          description="vs. período anterior"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Reservas"
          value={String(kpis.bookings)}
          trend="up"
          trendValue="+23"
          description="vs. período anterior"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Taxa de Ocupação"
          value={`${kpis.occupancyRate}%`}
          trend="up"
          trendValue="+5%"
          description="vs. período anterior"
          icon={<Percent className="h-4 w-4" />}
        />
        <KPICard
          title="Total Comissões"
          value={`R$ ${kpis.commissionTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend="down"
          trendValue="-3%"
          description="vs. período anterior"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Faturamento no Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v: number) => `R$${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Faturamento',
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento por Passeio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Passeio de Barco Corumbau', bookings: 98, revenue: 17640, occupancy: 82 },
              { name: 'Avistamento de Baleias', bookings: 72, revenue: 18000, occupancy: 90 },
              { name: 'Buggy até Caraíva', bookings: 85, revenue: 7650, occupancy: 71 },
              { name: 'Mergulho nos Recifes', bookings: 42, revenue: 4200, occupancy: 65 },
              { name: 'Monte Pascoal', bookings: 15, revenue: 310, occupancy: 50 },
            ].map((tour) => (
              <div key={tour.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{tour.name}</p>
                  <p className="text-xs text-muted-foreground">{tour.bookings} reservas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    R$ {tour.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">{tour.occupancy}% ocupação</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
