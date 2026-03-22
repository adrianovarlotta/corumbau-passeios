'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, Loader2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

function PendingContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="px-4 py-16 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>
      <h1 className="font-display text-2xl font-bold text-primary mb-2">
        Pagamento pendente
      </h1>
      <p className="text-muted-foreground mb-8">
        Seu pagamento está sendo processado. Você receberá uma notificação quando for confirmado.
      </p>

      {bookingId && (
        <p className="text-xs text-muted-foreground mb-6">
          Reserva: <span className="font-mono font-medium">{bookingId.slice(-8)}</span>
        </p>
      )}

      <div className="space-y-3">
        <ButtonLink href="/" className="w-full" variant="outline">
          Voltar para passeios
        </ButtonLink>
      </div>
    </div>
  )
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}>
      <PendingContent />
    </Suspense>
  )
}
