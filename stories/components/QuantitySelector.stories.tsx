import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { QuantitySelector } from '../../src/components/booking/QuantitySelector'

const meta: Meta<typeof QuantitySelector> = {
  title: 'Components/QuantitySelector',
  component: QuantitySelector,
}

export default meta
type Story = StoryObj<typeof QuantitySelector>

export const Adults: Story = {
  args: { label: 'Adultos', description: 'A partir de 12 anos', value: 2, min: 1, max: 20 },
}

export const Children: Story = {
  args: { label: 'Crianças', description: '2 a 11 anos', value: 0, min: 0, max: 10 },
}

export const Disabled: Story = {
  args: { label: 'Adultos', value: 1, min: 1, max: 1, disabled: true },
}

export const Interactive: Story = {
  render: () => {
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(0)
    return (
      <div className="space-y-4 max-w-sm">
        <QuantitySelector label="Adultos" description="A partir de 12 anos" value={adults} onChange={setAdults} min={1} max={20} />
        <QuantitySelector label="Crianças" description="2 a 11 anos" value={children} onChange={setChildren} min={0} max={10} />
        <p className="text-sm text-muted-foreground">Total: {adults + children} pessoas</p>
      </div>
    )
  },
}
