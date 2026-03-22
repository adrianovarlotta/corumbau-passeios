import { KPICard } from '@/components/admin/KPICard'
import { DollarSign, Users, CalendarDays, TrendingUp } from 'lucide-react'

export default function AdminOverviewPage() {
  // Placeholder — will be replaced with TanStack Query in V6
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas vendas e reservas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Faturamento Hoje"
          value="R$ 3.450,00"
          trend="up"
          trendValue="+12%"
          description="vs. ontem"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Reservas Hoje"
          value="14"
          trend="up"
          trendValue="+3"
          description="vs. ontem"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Faturamento Mês"
          value="R$ 47.800,00"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <KPICard
          title="Taxa Ocupação"
          value="78%"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Próximas Reservas</h2>
        <p className="text-sm text-muted-foreground">
          Conecte ao banco de dados para ver as reservas em tempo real (V6).
        </p>
      </div>
    </div>
  )
}
