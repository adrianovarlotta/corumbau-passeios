import type { Meta, StoryObj } from '@storybook/react'
import { PriceSummary } from '../../src/components/booking/PriceSummary'

const meta: Meta<typeof PriceSummary> = {
  title: 'Components/PriceSummary',
  component: PriceSummary,
}

export default meta
type Story = StoryObj<typeof PriceSummary>

export const Default: Story = {
  args: {
    tourName: 'Passeio Baleia Jubarte',
    date: '15 Jul 2026',
    time: '06:00',
    adults: 2,
    childCount: 0,
    priceAdult: 250,
    priceChild: 0,
  },
}

export const WithChildren: Story = {
  args: {
    tourName: 'Passeio de Barco ao Espelho',
    date: '20 Jul 2026',
    time: '09:00',
    adults: 2,
    childCount: 1,
    priceAdult: 180,
    priceChild: 90,
  },
}

export const Loading: Story = {
  args: { ...Default.args!, loading: true },
}
