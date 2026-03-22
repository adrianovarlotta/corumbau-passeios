import { cn } from '@/lib/utils'
import { QrCode, CreditCard } from 'lucide-react'

type PaymentMethod = 'PIX' | 'CREDIT_CARD'

interface PaymentToggleProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  className?: string
}

export function PaymentToggle({ value, onChange, className }: PaymentToggleProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <button
        type="button"
        className={cn(
          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
          value === 'PIX'
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border hover:border-muted-foreground'
        )}
        onClick={() => onChange('PIX')}
      >
        <QrCode className="h-8 w-8" />
        <span className="font-semibold text-sm">Pix</span>
        <span className="text-xs text-muted-foreground">Aprovação instantânea</span>
      </button>

      <button
        type="button"
        className={cn(
          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
          value === 'CREDIT_CARD'
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border hover:border-muted-foreground'
        )}
        onClick={() => onChange('CREDIT_CARD')}
      >
        <CreditCard className="h-8 w-8" />
        <span className="font-semibold text-sm">Cartão</span>
        <span className="text-xs text-muted-foreground">Crédito em até 12x</span>
      </button>
    </div>
  )
}
