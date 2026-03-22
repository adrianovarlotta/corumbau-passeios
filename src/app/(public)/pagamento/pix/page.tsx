'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Copy, Check, Clock, Loader2, QrCode, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PixPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{
    qrCode: string | null
    qrCodeBase64: string | null
    copyPaste: string | null
    ticketUrl: string | null
    expiresAt: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!bookingId) return

    async function initPix() {
      try {
        const res = await fetch('/api/payment/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        setPixData(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao gerar Pix')
      } finally {
        setLoading(false)
      }
    }

    initPix()
  }, [bookingId])

  // Poll for payment status every 5 seconds
  const checkStatus = useCallback(async () => {
    if (!bookingId || checking) return
    setChecking(true)
    try {
      const res = await fetch(`/api/payment/status?bookingId=${bookingId}`)
      const json = await res.json()
      if (json.data?.status === 'PAID') {
        router.push(`/pagamento/sucesso?bookingId=${bookingId}`)
      }
    } catch {
      // ignore
    } finally {
      setChecking(false)
    }
  }, [bookingId, checking, router])

  useEffect(() => {
    if (!pixData) return
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [pixData, checkStatus])

  async function handleCopy() {
    if (!pixData?.copyPaste) return
    await navigator.clipboard.writeText(pixData.copyPaste)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!bookingId) {
    return (
      <div className="px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="font-display text-xl font-bold">Reserva não encontrada</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-4 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="font-display text-lg font-bold text-primary">Gerando Pix...</p>
        <p className="text-sm text-muted-foreground mt-1">Aguarde um momento</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="font-display text-xl font-bold text-destructive">Erro no pagamento</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button onClick={() => router.back()} className="mt-6" variant="outline">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <QrCode className="h-7 w-7 text-emerald-600" />
        </div>
        <h1 className="font-display text-xl font-bold text-primary">Pagamento via Pix</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escaneie o QR Code ou copie o código para pagar
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        {pixData?.qrCodeBase64 ? (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${pixData.qrCodeBase64}`}
              alt="QR Code Pix"
              className="w-56 h-56 rounded-lg"
            />
          </div>
        ) : pixData?.ticketUrl ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              QR Code não disponível. Use o link abaixo:
            </p>
            <a
              href={pixData.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm font-medium"
            >
              Abrir página de pagamento
            </a>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">QR Code não disponível</p>
          </div>
        )}
      </div>

      {/* Copy Pix code */}
      {pixData?.copyPaste && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Pix Copia e Cola</p>
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed">
              {pixData.copyPaste.slice(0, 80)}...
            </p>
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar código Pix
              </>
            )}
          </Button>
        </div>
      )}

      {/* Status indicator */}
      <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3">
        <Clock className="h-5 w-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900">Aguardando pagamento</p>
          <p className="text-xs text-amber-700 mt-0.5">
            O pagamento será confirmado automaticamente
          </p>
        </div>
        {checking && <Loader2 className="h-4 w-4 animate-spin text-amber-600 ml-auto" />}
      </div>
    </div>
  )
}

export default function PixPaymentPage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
      </div>
    }>
      <PixPaymentContent />
    </Suspense>
  )
}
