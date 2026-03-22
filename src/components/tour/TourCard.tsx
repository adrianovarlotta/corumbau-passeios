import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { TourCategoryBadge } from './TourCategoryBadge'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type TourCategory = 'WHALE' | 'BOAT' | 'BUGGY' | 'EXPERIENCE'

interface TourCardProps {
  name: string
  slug: string
  category: TourCategory
  priceAdult: number
  duration: string
  image: string
  featured?: boolean
  compact?: boolean
  onClick?: () => void
  className?: string
}

export function TourCard({
  name, category, priceAdult, duration, image, featured, compact, onClick, className
}: TourCardProps) {
  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1',
        featured && 'ring-2 ring-accent',
        compact && 'flex-row',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', compact ? 'w-24 h-24' : 'aspect-[4/3]')}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes={compact ? '96px' : '(max-width: 768px) 100vw, 33vw'}
        />
        {featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
              Destaque
            </span>
          </div>
        )}
      </div>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <TourCategoryBadge category={category} showIcon={!compact} />
        <h3 className={cn('font-semibold mt-2', compact ? 'text-sm' : 'text-lg')}>
          {name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-muted-foreground text-sm">{duration}</span>
          <span className="font-bold text-primary">
            R$ {priceAdult.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function TourCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <Skeleton className={cn(compact ? 'w-24 h-24' : 'aspect-[4/3] w-full')} />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
