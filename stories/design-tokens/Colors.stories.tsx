import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '../../design-system/tokens'

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className="w-12 h-12 rounded-lg border border-border shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{hex}</p>
      </div>
    </div>
  )
}

function ColorGroup({ title, colors }: { title: string; colors: [string, string][] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {colors.map(([name, hex]) => (
          <ColorSwatch key={name} name={name} hex={hex} />
        ))}
      </div>
    </div>
  )
}

function AllColors() {
  const brand = Object.entries(tokens.colors).filter(([k]) => k.startsWith('brand'))
  const semantic = Object.entries(tokens.colors).filter(([k]) =>
    ['background', 'foreground', 'card', 'cardForeground', 'popover', 'popoverForeground',
     'primary', 'primaryForeground', 'secondary', 'secondaryForeground', 'muted', 'mutedForeground',
     'accent', 'accentForeground', 'destructive', 'destructiveForeground', 'border', 'input', 'ring'
    ].includes(k)
  )
  const surface = Object.entries(tokens.colors).filter(([k]) =>
    ['surface', 'surfaceElevated', 'borderSubtle'].includes(k)
  )
  const text = Object.entries(tokens.colors).filter(([k]) => k.startsWith('text'))
  const status = Object.entries(tokens.colors).filter(([k]) =>
    ['success', 'successLight', 'warning', 'warningLight', 'error', 'errorLight', 'info', 'infoLight'].includes(k)
  )
  const categories = Object.entries(tokens.colors).filter(([k]) =>
    ['whale', 'boat', 'buggy', 'experience'].includes(k)
  )

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">🎨 Corumbau Passeios — Paleta de Cores</h2>
      <ColorGroup title="Brand" colors={brand} />
      <ColorGroup title="Semantic (Tailwind)" colors={semantic} />
      <ColorGroup title="Surface" colors={surface} />
      <ColorGroup title="Text" colors={text} />
      <ColorGroup title="Status" colors={status} />
      <ColorGroup title="Tour Categories" colors={categories} />
    </div>
  )
}

const meta: Meta = {
  title: 'Design Tokens/Colors',
  component: AllColors,
}

export default meta
type Story = StoryObj

export const Default: Story = {}
