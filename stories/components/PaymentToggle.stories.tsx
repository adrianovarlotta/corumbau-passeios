import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PaymentToggle } from '../../src/components/payment/PaymentToggle'

const meta: Meta<typeof PaymentToggle> = {
  title: 'Components/PaymentToggle',
  component: PaymentToggle,
}

export default meta
type Story = StoryObj<typeof PaymentToggle>

export const PixSelected: Story = {
  args: { value: 'PIX', onChange: () => {} },
}

export const CardSelected: Story = {
  args: { value: 'CREDIT_CARD', onChange: () => {} },
}

export const Interactive: Story = {
  render: () => {
    const [method, setMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX')
    return (
      <div className="max-w-sm">
        <PaymentToggle value={method} onChange={setMethod} />
        <p className="mt-4 text-sm text-muted-foreground">Selecionado: {method}</p>
      </div>
    )
  },
}
