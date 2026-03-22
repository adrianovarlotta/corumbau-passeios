import { cn } from '@/lib/utils'
import { Check, Clock } from 'lucide-react'

interface CheckinRowProps {
  customerName: string
  adults: number
  childCount: number
  voucherCode: string
  checkedIn: boolean
  onClick?: () => void
  className?: string
}

export function CheckinRow({ customerName, adults, childCount, voucherCode, checkedIn, onClick, className }: CheckinRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors',
        checkedIn ? 'bg-emerald-50 border-emerald-200' : 'bg-card hover:bg-muted',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
        checkedIn ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
      )}>
        {checkedIn ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate', checkedIn && 'line-through text-muted-foreground')}>
          {customerName}
        </p>
        <p className="text-sm text-muted-foreground">
          {adults} adulto{adults > 1 ? 's' : ''}{childCount > 0 ? ` · ${childCount} criança${childCount > 1 ? 's' : ''}` : ''}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="font-mono text-sm font-bold text-primary tracking-wider">
          {voucherCode}
        </span>
      </div>
    </div>
  )
}
