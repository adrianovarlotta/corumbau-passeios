import type { Meta, StoryObj } from '@storybook/react'
import { KPICard } from '../../src/components/admin/KPICard'
import { DollarSign, Users, CalendarDays, TrendingUp } from 'lucide-react'

const meta: Meta<typeof KPICard> = {
  title: 'Components/KPICard',
  component: KPICard,
}

export default meta
type Story = StoryObj<typeof KPICard>

export const Revenue: Story = {
  args: {
    title: 'Faturamento Hoje',
    value: 'R$ 3.450,00',
    trend: 'up',
    trendValue: '+12%',
    description: 'vs. ontem',
    icon: <DollarSign className="h-4 w-4" />,
  },
}

export const Bookings: Story = {
  args: {
    title: 'Reservas Hoje',
    value: '14',
    trend: 'up',
    trendValue: '+3',
    description: 'vs. ontem',
    icon: <Users className="h-4 w-4" />,
  },
}

export const MonthRevenue: Story = {
  args: {
    title: 'Faturamento Mês',
    value: 'R$ 47.800,00',
    trend: 'down',
    trendValue: '-5%',
    description: 'vs. mês anterior',
    icon: <CalendarDays className="h-4 w-4" />,
  },
}

export const Occupancy: Story = {
  args: {
    title: 'Taxa Ocupação',
    value: '78%',
    icon: <TrendingUp className="h-4 w-4" />,
  },
}

export const Loading: Story = {
  args: { title: '', value: '', loading: true },
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Faturamento Hoje" value="R$ 3.450,00" trend="up" trendValue="+12%" description="vs. ontem" icon={<DollarSign className="h-4 w-4" />} />
      <KPICard title="Reservas Hoje" value="14" trend="up" trendValue="+3" description="vs. ontem" icon={<Users className="h-4 w-4" />} />
      <KPICard title="Faturamento Mês" value="R$ 47.800,00" trend="down" trendValue="-5%" description="vs. mês anterior" icon={<CalendarDays className="h-4 w-4" />} />
      <KPICard title="Taxa Ocupação" value="78%" icon={<TrendingUp className="h-4 w-4" />} />
    </div>
  ),
}
