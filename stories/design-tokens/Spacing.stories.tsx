import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../../design-system/tokens'

function SpacingShowcase() {
  return (
    <div className="p-6 max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold mb-6">📐 Spacing</h2>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2">Escala de Espaçamento</h3>
        {Object.entries(tokens.spacing).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono w-12">{name}</span>
            <span className="text-xs text-muted-foreground w-16">{value}</span>
            <div
              className="h-4 bg-primary rounded"
              style={{ width: `calc(${value} * 8)` }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2">Border Radius</h3>
        {Object.entries(tokens.radius).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono w-12">{name}</span>
            <span className="text-xs text-muted-foreground w-16">{value}</span>
            <div
              className="w-16 h-16 bg-primary"
              style={{ borderRadius: value }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2">Shadows</h3>
        {Object.entries(tokens.shadows).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono w-12">{name}</span>
            <div
              className="w-24 h-16 bg-card rounded-lg border"
              style={{ boxShadow: value }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  component: SpacingShowcase,
}

export default meta
type Story = StoryObj

export const Default: Story = {}
