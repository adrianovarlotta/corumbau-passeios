import type { Meta, StoryObj } from '@storybook/react'
import { EmbarkCounter } from '../../src/components/checkin/EmbarkCounter'

const meta: Meta<typeof EmbarkCounter> = {
  title: 'Components/EmbarkCounter',
  component: EmbarkCounter,
}

export default meta
type Story = StoryObj<typeof EmbarkCounter>

export const InProgress: Story = { args: { checked: 8, total: 20 } }
export const AllBoarded: Story = { args: { checked: 20, total: 20 } }
export const Empty: Story = { args: { checked: 0, total: 15 } }
export const SmallGroup: Story = { args: { checked: 2, total: 4 } }
