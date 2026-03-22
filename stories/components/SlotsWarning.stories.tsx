import type { Meta, StoryObj } from '@storybook/react'
import { SlotsWarning } from '../../src/components/ui/SlotsWarning'

const meta: Meta<typeof SlotsWarning> = {
  title: 'Components/SlotsWarning',
  component: SlotsWarning,
}

export default meta
type Story = StoryObj<typeof SlotsWarning>

export const FewSlots: Story = { args: { available: 3 } }
export const LastSlot: Story = { args: { available: 1 } }
export const Hidden: Story = { args: { available: 10 } }
