import type { Meta, StoryObj } from '@storybook/react'
import { VoucherCard } from '../../src/components/voucher/VoucherCard'

const meta: Meta<typeof VoucherCard> = {
  title: 'Components/VoucherCard',
  component: VoucherCard,
}

export default meta
type Story = StoryObj<typeof VoucherCard>

export const Default: Story = {
  args: {
    voucherCode: 'HK7W3P',
    tourName: 'Passeio Baleia Jubarte',
    date: '15 Jul 2026',
    time: '06:00',
    adults: 2,
    children: 1,
    customerName: 'João Silva',
    qrCodeUrl: 'https://placehold.co/200x200/0B6E8E/FFFFFF?text=QR',
  },
}

export const Compact: Story = {
  args: { ...Default.args!, compact: true },
}

export const NoQR: Story = {
  args: { ...Default.args!, qrCodeUrl: undefined },
}
