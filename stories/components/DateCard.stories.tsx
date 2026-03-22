import type { Meta, StoryObj } from '@storybook/react'
import { DateCard } from '../../src/components/admin/DateCard'

const meta: Meta<typeof DateCard> = {
  title: 'Components/DateCard',
  component: DateCard,
}

export default meta
type Story = StoryObj<typeof DateCard>

export const Open: Story = {
  args: { date: '15 Jul 2026', time: '06:00', totalSlots: 20, bookedSlots: 8, status: 'OPEN' },
}

export const AlmostFull: Story = {
  args: { date: '16 Jul 2026', time: '06:00', totalSlots: 20, bookedSlots: 18, status: 'OPEN' },
}

export const Full: Story = {
  args: { date: '17 Jul 2026', time: '06:00', totalSlots: 20, bookedSlots: 20, status: 'FULL' },
}

export const Cancelled: Story = {
  args: { date: '18 Jul 2026', time: '06:00', totalSlots: 20, bookedSlots: 12, status: 'CANCELLED', cancelReason: 'Mau tempo' },
}

export const Loading: Story = {
  args: { date: '', time: '', totalSlots: 0, bookedSlots: 0, status: 'OPEN', loading: true },
}
