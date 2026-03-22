import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CATEGORY_CONFIG = {
  WHALE: { label: 'Baleia Jubarte', bg: 'bg-blue-900/10', text: 'text-blue-900', icon: '🐋' },
  BOAT: { label: 'Barco', bg: 'bg-cyan-600/10', text: 'text-cyan-700', icon: '⛵' },
  BUGGY: { label: 'Buggy', bg: 'bg-amber-700/10', text: 'text-amber-800', icon: '🏖️' },
  EXPERIENCE: { label: 'Vivência', bg: 'bg-violet-600/10', text: 'text-violet-700', icon: '✨' },
} as const

type TourCategory = keyof typeof CATEGORY_CONFIG

interface TourCategoryBadgeProps {
  category: TourCategory
  showIcon?: boolean
  className?: string
}

export function TourCategoryBadge({ category, showIcon = true, className }: TourCategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category]
  return (
    <Badge
      variant="outline"
      className={cn(config.bg, config.text, 'border-0 font-medium', className)}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  )
}
