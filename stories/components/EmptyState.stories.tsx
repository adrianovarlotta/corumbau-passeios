import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '../../src/components/ui/EmptyState'
import { Button } from '../../src/components/ui/button'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const NoTours: Story = {
  args: {
    icon: '🏖️',
    title: 'Nenhum passeio disponível',
    description: 'Os passeios da temporada serão publicados em breve.',
  },
}

export const NoBookings: Story = {
  args: {
    icon: '📋',
    title: 'Nenhuma reserva encontrada',
    description: 'Não há reservas para este período.',
  },
}

export const WithAction: Story = {
  args: {
    icon: '➕',
    title: 'Nenhum passeio cadastrado',
    description: 'Comece cadastrando seu primeiro passeio.',
    action: <Button>+ Novo Passeio</Button>,
  },
}
