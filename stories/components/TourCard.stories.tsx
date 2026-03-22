import type { Meta, StoryObj } from '@storybook/react'
import { TourCard, TourCardSkeleton } from '../../src/components/tour/TourCard'

const meta: Meta<typeof TourCard> = {
  title: 'Components/TourCard',
  component: TourCard,
}

export default meta
type Story = StoryObj<typeof TourCard>

const defaultArgs = {
  name: 'Passeio Baleia Jubarte',
  slug: 'baleia-jubarte',
  category: 'WHALE' as const,
  priceAdult: 250,
  duration: '4 horas',
  image: 'https://placehold.co/600x400/0B6E8E/FFFFFF?text=Baleia+Jubarte',
}

export const Default: Story = { args: defaultArgs }
export const Featured: Story = { args: { ...defaultArgs, featured: true } }
export const Compact: Story = { args: { ...defaultArgs, compact: true } }

export const Boat: Story = {
  args: {
    name: 'Passeio de Barco ao Espelho',
    slug: 'barco-espelho',
    category: 'BOAT',
    priceAdult: 180,
    duration: '6 horas',
    image: 'https://placehold.co/600x400/0891B2/FFFFFF?text=Barco',
  },
}

export const Loading: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      <TourCardSkeleton />
      <TourCardSkeleton />
      <TourCardSkeleton />
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
      <TourCard {...defaultArgs} />
      <TourCard
        name="Passeio de Barco ao Espelho"
        slug="barco-espelho"
        category="BOAT"
        priceAdult={180}
        duration="6 horas"
        image="https://placehold.co/600x400/0891B2/FFFFFF?text=Barco"
      />
      <TourCard
        name="Passeio de Buggy pela Costa"
        slug="buggy-costa"
        category="BUGGY"
        priceAdult={320}
        duration="Dia inteiro"
        image="https://placehold.co/600x400/B45309/FFFFFF?text=Buggy"
        featured
      />
    </div>
  ),
}
