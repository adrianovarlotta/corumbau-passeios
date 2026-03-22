import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../../design-system/tokens'

function TypographyShowcase() {
  const sizes = Object.entries(tokens.typography).filter(([k]) => k.startsWith('size'))

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold mb-6">📝 Tipografia</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Font Families</h3>
        <p style={{ fontFamily: tokens.typography.fontDisplay }} className="text-3xl">
          Playfair Display — Títulos premium
        </p>
        <p style={{ fontFamily: tokens.typography.fontBody }} className="text-lg">
          Inter — Corpo de texto e interface
        </p>
        <p style={{ fontFamily: tokens.typography.fontMono }} className="text-base">
          JetBrains Mono — Códigos de voucher: ABC123
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2">Escala de Tamanhos</h3>
        {sizes.map(([name, value]) => (
          <div key={name} className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground font-mono w-20">{name}</span>
            <span className="text-xs text-muted-foreground w-16">{value}</span>
            <span style={{ fontSize: value }}>Passeio de Baleia Jubarte</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b pb-2">Font Weights</h3>
        {Object.entries(tokens.typography)
          .filter(([k]) => k.startsWith('weight'))
          .map(([name, value]) => (
            <p key={name} className="text-lg" style={{ fontWeight: value }}>
              {name} ({value}) — Corumbau Passeios
            </p>
          ))}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Design Tokens/Typography',
  component: TypographyShowcase,
}

export default meta
type Story = StoryObj

export const Default: Story = {}
