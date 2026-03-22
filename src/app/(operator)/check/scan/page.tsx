'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

function QrScannerInner() {
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<import('html5-qrcode').Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: boolean
    message: string
    customerName?: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const processingRef = useRef(false)

  const handleCheckin = useCallback(async (voucherCode: string) => {
    if (processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)
    setLastResult(null)

    try {
      const res = await fetch('/api/operator/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode }),
      })

      const json = await res.json()

      if (json.success) {
        setLastResult({
          success: true,
          message: `Check-in realizado!`,
          customerName: json.data.customerName,
        })
        toast.success(`${json.data.customerName} embarcado(a)!`)
      } else {
        setLastResult({
          success: false,
          message: json.error || 'Erro desconhecido',
        })
        toast.error(json.error || 'Erro ao realizar check-in')
      }
    } catch {
      setLastResult({
        success: false,
        message: 'Erro de conexão',
      })
      toast.error('Erro de conexão com o servidor')
    } finally {
      setIsProcessing(false)
      // Allow new scans after a brief delay
      setTimeout(() => {
        processingRef.current = false
      }, 2000)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function startScanner() {
      const { Html5Qrcode } = await import('html5-qrcode')

      if (!mounted || !scannerRef.current) return

      const scanner = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = scanner

      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleCheckin(decodedText)
          },
          () => {
            // ignore scan failures (no QR in frame)
          }
        )
        if (mounted) setIsScanning(true)
      } catch (err) {
        console.error('Camera error:', err)
        if (mounted) {
          toast.error('Erro ao acessar a câmera. Verifique as permissões.')
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [handleCheckin])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ButtonLink href="/check" variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </ButtonLink>
        <div>
          <h1 className="text-lg font-bold text-primary">Escanear QR Code</h1>
          <p className="text-sm text-muted-foreground">
            Aponte a câmera para o voucher
          </p>
        </div>
      </div>

      {/* Scanner viewfinder */}
      <div className="relative overflow-hidden rounded-xl border bg-black">
        <div id="qr-reader" ref={scannerRef} className="w-full" />
        {!isScanning && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Iniciando câmera...
          </div>
        )}
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verificando voucher...</span>
        </div>
      )}

      {/* Result feedback */}
      {lastResult && !isProcessing && (
        <div
          className={cn(
            'rounded-lg border p-4 flex items-start gap-3',
            lastResult.success
              ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20'
              : 'border-destructive/50 bg-red-50 dark:bg-red-950/20'
          )}
        >
          {lastResult.success ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={cn(
                'font-medium',
                lastResult.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
              )}
            >
              {lastResult.message}
            </p>
            {lastResult.customerName && (
              <p className="text-sm text-muted-foreground mt-1">
                {lastResult.customerName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Back button */}
      <ButtonLink href="/check" variant="outline" className="w-full">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </ButtonLink>
    </div>
  )
}

const QrScannerPage = dynamic(() => Promise.resolve(QrScannerInner), {
  ssr: false,
})

export default function ScanPage() {
  return <QrScannerPage />
}
