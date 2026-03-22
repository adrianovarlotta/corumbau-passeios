'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { QuantitySelector } from '@/components/booking/QuantitySelector'
import { PriceSummary } from '@/components/booking/PriceSummary'
import { PaymentToggle } from '@/components/payment/PaymentToggle'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// TODO: Replace with TanStack Query hook (fetch from /api/tours/[slug])
const MOCK_TOUR = {
  id: 'clx1234567890',
  name: 'Passeio Baleia Jubarte',
  slug: 'baleia-jubarte',
  priceAdult: 250,
  priceChild: 150,
  maxCapacity: 20,
  tourDates: [
    {
      id: 'td1',
      date: '2026-03-25T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 12,
    },
    {
      id: 'td2',
      date: '2026-03-25T00:00:00Z',
      time: '14:00',
      totalSlots: 20,
      bookedSlots: 18,
    },
    {
      id: 'td3',
      date: '2026-03-26T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 5,
    },
    {
      id: 'td4',
      date: '2026-03-27T00:00:00Z',
      time: '08:00',
      totalSlots: 20,
      bookedSlots: 0,
    },
  ],
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tourDateId = searchParams.get('tourDateId')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Fetch tour from API based on slug param
  const tour = MOCK_TOUR
  const selectedDate = tour.tourDates.find((td) => td.id === tourDateId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      adults: 1,
      children: 0,
      tourDateId: tourDateId || '',
      paymentMethod: 'PIX',
      partnerCode: '',
    },
  })

  const adults = watch('adults')
  const children = watch('children') ?? 0
  const paymentMethod = watch('paymentMethod')

  const availableSlots = selectedDate
    ? selectedDate.totalSlots - selectedDate.bookedSlots
    : 0

  async function onSubmit(data: CheckoutInput) {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Erro ao criar reserva')
      }

      const { data: booking } = await res.json()
      router.push(`/voucher/${booking.voucherCode}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setSubmitting(false)
    }
  }

  if (!tourDateId || !selectedDate) {
    return (
      <div className="container px-4 py-16 text-center">
        <p className="text-lg font-semibold">Data nao encontrada</p>
        <p className="text-muted-foreground mt-2">
          Selecione uma data disponivel na pagina do passeio.
        </p>
        <Link
          href={`/passeios/${tour.slug}`}
          className="text-primary underline mt-4 inline-block"
        >
          Voltar ao passeio
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      {/* Back link */}
      <Link
        href={`/passeios/${tour.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao passeio
      </Link>

      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Finalizar Reserva</h1>
      <p className="text-muted-foreground mb-8">
        Preencha seus dados para confirmar a reserva
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Summary */}
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold text-lg">{tour.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedDate.date)} as {selectedDate.time}h
                </p>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados do Responsavel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nome completo</Label>
                  <Input
                    id="customerName"
                    placeholder="Seu nome completo"
                    {...register('customerName')}
                    aria-invalid={!!errors.customerName}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('customerEmail')}
                    aria-invalid={!!errors.customerEmail}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-destructive">
                      {errors.customerEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Telefone / WhatsApp</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="(73) 99999-9999"
                    {...register('customerPhone')}
                    aria-invalid={!!errors.customerPhone}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-destructive">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerCode">
                    Codigo do parceiro{' '}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </Label>
                  <Input
                    id="partnerCode"
                    placeholder="Ex: HOTEL123"
                    {...register('partnerCode')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quantities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Passageiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuantitySelector
                  label="Adultos"
                  description={`R$ ${tour.priceAdult.toFixed(2).replace('.', ',')} por pessoa`}
                  value={adults}
                  min={1}
                  max={availableSlots}
                  onChange={(v) => setValue('adults', v, { shouldValidate: true })}
                />
                <Separator />
                <QuantitySelector
                  label="Criancas"
                  description={`R$ ${tour.priceChild.toFixed(2).replace('.', ',')} por crianca (ate 11 anos)`}
                  value={children}
                  min={0}
                  max={Math.max(0, availableSlots - adults)}
                  onChange={(v) => setValue('children', v, { shouldValidate: true })}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentToggle
                  value={paymentMethod}
                  onChange={(m) =>
                    setValue('paymentMethod', m, { shouldValidate: true })
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar — Order Summary */}
          <div className="space-y-4">
            <PriceSummary
              tourName={tour.name}
              date={formatDate(selectedDate.date)}
              time={selectedDate.time}
              adults={adults}
              childCount={children}
              priceAdult={tour.priceAdult}
              priceChild={tour.priceChild}
            />

            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao confirmar, voce concorda com nossos termos de uso e politica de
              cancelamento.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
