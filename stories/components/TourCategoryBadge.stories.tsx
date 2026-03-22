import type { Meta, StoryObj } from '@storybook/react'
import { TourCategoryBadge } from '../../src/components/tour/TourCategoryBadge'

const meta: Meta<typeof TourCategoryBadge> = {
  title: 'Components/TourCategoryBadge',
  component: TourCategoryBadge,
  argTypes: {
    category: {
      control: 'select',
      options: ['WHALE', 'BOAT', 'BUGGY', 'EXPERIENCE'],
    },
    showIcon: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof TourCategoryBadge>

export const Whale: Story = { args: { category: 'WHALE' } }
export const Boat: Story = { args: { category: 'BOAT' } }
export const Buggy: Story = { args: { category: 'BUGGY' } }
export const Experience: Story = { args: { category: 'EXPERIENCE' } }
export const NoIcon: Story = { args: { category: 'WHALE', showIcon: false } }

export const AllCategories: Story = {
  render: () => (
    <div className="flex gap-2">
      <TourCategoryBadge category="WHALE" />
      <TourCategoryBadge category="BOAT" />
      <TourCategoryBadge category="BUGGY" />
      <TourCategoryBadge category="EXPERIENCE" />
    </div>
  ),
}
