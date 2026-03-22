import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  description?: string
  trend?: 'up' | 'down'
  trendValue?: string
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

export function KPICard({ title, value, description, trend, trendValue, icon, loading, className }: KPICardProps) {
  if (loading) return <KPICardSkeleton />

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {(description || trend) && (
          <div className="flex items-center gap-1 mt-1">
            {trend && (
              <span className={cn(
                'flex items-center text-xs font-medium',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {trendValue}
              </span>
            )}
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function KPICardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}
