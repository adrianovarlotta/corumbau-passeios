import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Users, Clock, X, Eye } from 'lucide-react'

type DateStatus = 'OPEN' | 'FULL' | 'CANCELLED'

interface DateCardProps {
  date: string
  time: string
  totalSlots: number
  bookedSlots: number
  status: DateStatus
  cancelReason?: string
  onViewManifest?: () => void
  onCancel?: () => void
  loading?: boolean
  className?: string
}

const STATUS_CONFIG = {
  OPEN: { label: 'Aberto', variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800 border-0' },
  FULL: { label: 'Lotado', variant: 'default' as const, className: 'bg-amber-100 text-amber-800 border-0' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' as const, className: '' },
}

export function DateCard({
  date, time, totalSlots, bookedSlots, status, cancelReason, onViewManifest, onCancel, loading, className
}: DateCardProps) {
  if (loading) return <DateCardSkeleton />

  const available = totalSlots - bookedSlots
  const occupancy = Math.round((bookedSlots / totalSlots) * 100)
  const config = STATUS_CONFIG[status]

  return (
    <Card className={cn(status === 'CANCELLED' && 'opacity-60', className)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{date}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {time}
            </p>
          </div>
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        </div>

        {status !== 'CANCELLED' && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{bookedSlots}</span>
              <span className="text-muted-foreground">/ {totalSlots} vagas</span>
              <span className={cn(
                'ml-auto font-medium',
                available <= 3 && available > 0 && 'text-amber-600',
                available === 0 && 'text-red-600',
              )}>
                {available > 0 ? `${available} disponíveis` : 'Esgotado'}
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  occupancy < 70 ? 'bg-emerald-500' : occupancy < 90 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </>
        )}

        {status === 'CANCELLED' && cancelReason && (
          <p className="text-sm text-muted-foreground italic">Motivo: {cancelReason}</p>
        )}

        <div className="flex gap-2">
          {status !== 'CANCELLED' && (
            <>
              <Button variant="outline" size="sm" className="flex-1" onClick={onViewManifest}>
                <Eye className="h-3 w-3 mr-1" /> Manifest
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onCancel}>
                <X className="h-3 w-3 mr-1" /> Cancelar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DateCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
