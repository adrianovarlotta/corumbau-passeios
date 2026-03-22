import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface SlotsWarningProps {
  available: number
  className?: string
}

export function SlotsWarning({ available, className }: SlotsWarningProps) {
  if (available > 3) return null

  const isLast = available === 1

  return (
    <div className={cn(
      'flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2',
      isLast ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700',
      className
    )}>
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      {isLast
        ? 'Última vaga disponível!'
        : `Apenas ${available} vagas restantes!`
      }
    </div>
  )
}
