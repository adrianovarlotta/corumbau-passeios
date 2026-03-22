import type { Meta, StoryObj } from '@storybook/react'
import { CommissionRow } from '../../src/components/admin/CommissionRow'

const meta: Meta<typeof CommissionRow> = {
  title: 'Components/CommissionRow',
  component: CommissionRow,
}

export default meta
type Story = StoryObj<typeof CommissionRow>

export const Pending: Story = {
  args: {
    operatorName: 'Capitão João',
    tourName: 'Baleia Jubarte',
    date: '15 Jul 2026',
    amount: 125,
    percentage: 10,
    isPaid: false,
  },
}

export const Selected: Story = {
  args: { ...Pending.args, selected: true },
}

export const Paid: Story = {
  args: { ...Pending.args, isPaid: true },
}
