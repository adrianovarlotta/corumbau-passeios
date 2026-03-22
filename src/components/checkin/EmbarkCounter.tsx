import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

interface EmbarkCounterProps {
  checked: number
  total: number
  className?: string
}

export function EmbarkCounter({ checked, total, className }: EmbarkCounterProps) {
  const allBoarded = checked === total && total > 0
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Users className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            {checked} de {total} embarcados
          </span>
          {allBoarded && (
            <Badge className="bg-emerald-500 text-white border-0">
              Todos a bordo
            </Badge>
          )}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              allBoarded ? 'bg-emerald-500' : 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
