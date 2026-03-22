import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface VoucherCardProps {
  voucherCode: string
  tourName: string
  date: string
  time: string
  adults: number
  children: number
  customerName: string
  qrCodeUrl?: string
  compact?: boolean
  className?: string
}

export function VoucherCard({
  voucherCode, tourName, date, time, adults, children, customerName, qrCodeUrl, compact, className
}: VoucherCardProps) {
  return (
    <Card className={cn('border-2 border-dashed border-primary/30', compact && 'text-sm', className)}>
      <CardContent className={cn('p-6 text-center space-y-4', compact && 'p-4 space-y-2')}>
        {qrCodeUrl && (
          <div className="flex justify-center">
            <Image
              src={qrCodeUrl}
              alt={`QR Code: ${voucherCode}`}
              width={compact ? 96 : 160}
              height={compact ? 96 : 160}
              className="rounded-lg"
            />
          </div>
        )}

        <div className="font-mono text-2xl font-bold tracking-widest text-primary">
          {voucherCode}
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-lg">{tourName}</p>
          <p className="text-muted-foreground">
            📅 {date} às {time}
          </p>
          <p className="text-muted-foreground">
            👤 {customerName} · {adults} adulto{adults > 1 ? 's' : ''}
            {children > 0 && ` · ${children} criança${children > 1 ? 's' : ''}`}
          </p>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-3">
          Apresente este voucher no embarque. Válido somente para a data indicada.
        </p>
      </CardContent>
    </Card>
  )
}
