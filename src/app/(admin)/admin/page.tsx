'use client'

import { KPICard } from '@/components/admin/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, Users, TrendingUp, Ship } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const revenueChartData = [
  { day: '15/03', valor: 5200 },
  { day: '16/03', valor: 7800 },
  { day: '17/03', valor: 6400 },
  { day: '18/03', valor: 9100 },
  { day: '19/03', valor: 7200 },
  { day: '20/03', valor: 8500 },
  { day: '21/03', valor: 3600 },
]

const recentBookings = [
  { id: 1, customer: 'Maria Silva', tour: 'Passeio de Barco Corumbau', date: '21/03', amount: 360, status: 'confirmed' },
  { id: 2, customer: 'João Santos', tour: 'Avistamento de Baleias', date: '21/03', amount: 500, status: 'confirmed' },
  { id: 3, customer: 'Ana Oliveira', tour: 'Buggy até Caraíva', date: '22/03', amount: 180, status: 'pending' },
  { id: 4, customer: 'Carlos Mendes', tour: 'Mergulho nos Recifes', date: '22/03', amount: 200, status: 'confirmed' },
  { id: 5, customer: 'Lucia Ferreira', tour: 'Monte Pascoal', date: '23/03', amount: 120, status: 'pending' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  confirmed: { label: 'Confirmado', variant: 'default' },
  pending: { label: 'Pendente', variant: 'secondary' },
}

export default function AdminOverviewPage() {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground capitalize">{today}</p>
      </div>

      {/* Big Revenue Number */}
      <Card className="border-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Faturamento do mês</p>
          <p className="text-4xl font-bold text-emerald-600 mt-1">
            R$ 47.800,00
          </p>
          <p className="text-sm text-muted-foreground mt-1">Março 2026</p>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Reservas Hoje"
          value="14"
          trend="up"
          trendValue="+3"
          description="vs. ontem"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Faturamento Hoje"
          value="R$ 3.450"
          trend="up"
          trendValue="+12%"
          description="vs. ontem"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Taxa Ocupação"
          value="78%"
          trend="up"
          trendValue="+5%"
          description="vs. semana passada"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Passeios Amanhã"
          value="3"
          description="6 vagas restantes"
          icon={<Ship className="h-4 w-4" />}
        />
      </div>

      {/* Revenue Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Faturamento - Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                  className="text-muted-foreground"
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
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Passeio</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => {
                const status = statusMap[booking.status]
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.customer}</TableCell>
                    <TableCell>{booking.tour}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell className="text-right">
                      R$ {booking.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
