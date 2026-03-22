import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PriceSummaryProps {
  tourName: string
  date: string
  time: string
  adults: number
  childCount: number
  priceAdult: number
  priceChild: number
  loading?: boolean
  className?: string
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

export function PriceSummary({
  tourName, date, time, adults, childCount, priceAdult, priceChild, loading, className
}: PriceSummaryProps) {
  const totalAdults = adults * priceAdult
  const totalChildren = childCount * priceChild
  const total = totalAdults + totalChildren

  if (loading) return <PriceSummarySkeleton />

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-semibold">{tourName}</p>
        <p className="text-sm text-muted-foreground">
          📅 {date} às {time}
        </p>

        <Separator />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{adults}x Adulto</span>
            <span>{formatCurrency(totalAdults)}</span>
          </div>
          {childCount > 0 && (
            <div className="flex justify-between">
              <span>{childCount}x Criança</span>
              <span>{formatCurrency(totalChildren)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function PriceSummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3"><Skeleton className="h-5 w-32" /></CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Separator />
        <Skeleton className="h-4 w-full" />
        <Separator />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  )
}
