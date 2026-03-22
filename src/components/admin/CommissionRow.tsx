import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CommissionRowProps {
  operatorName: string
  tourName: string
  date: string
  amount: number
  percentage: number
  isPaid: boolean
  selected?: boolean
  onSelect?: (checked: boolean) => void
  className?: string
}

export function CommissionRow({
  operatorName, tourName, date, amount, percentage, isPaid, selected, onSelect, className
}: CommissionRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-lg border transition-colors',
      selected && 'bg-primary/5 border-primary/30',
      isPaid && 'opacity-60',
      className
    )}>
      {!isPaid && onSelect && (
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium">{operatorName}</p>
        <p className="text-sm text-muted-foreground truncate">{tourName} · {date}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-semibold">R$ {amount.toFixed(2).replace('.', ',')}</p>
        <p className="text-xs text-muted-foreground">{percentage}%</p>
      </div>

      <Badge variant={isPaid ? 'default' : 'outline'} className={cn(isPaid && 'bg-emerald-500 border-0')}>
        {isPaid ? 'Pago' : 'Pendente'}
      </Badge>
    </div>
  )
}
