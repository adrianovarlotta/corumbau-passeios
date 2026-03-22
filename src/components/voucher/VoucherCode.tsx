import { cn } from '@/lib/utils'

interface VoucherCodeProps {
  code: string
  className?: string
}

export function VoucherCode({ code, className }: VoucherCodeProps) {
  return (
    <span className={cn('font-mono text-lg font-bold tracking-[0.25em] text-primary', className)}>
      {code}
    </span>
  )
}
