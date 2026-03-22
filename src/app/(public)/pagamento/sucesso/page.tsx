'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="px-4 py-16 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="font-display text-2xl font-bold text-primary mb-2">
        Pagamento confirmado!
      </h1>
      <p className="text-muted-foreground mb-8">
        Sua reserva foi confirmada com sucesso. Você receberá um e-mail com o voucher do passeio.
      </p>

      {bookingId && (
        <p className="text-xs text-muted-foreground mb-6">
          Código da reserva: <span className="font-mono font-medium">{bookingId.slice(-8)}</span>
        </p>
      )}

      <div className="space-y-3">
        <ButtonLink
          href="/"
          className="w-full bg-primary text-primary-foreground"
        >
          Ver mais passeios
        </ButtonLink>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
