import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getPaymentStatus } from '@/lib/mercadopago'
import { PaymentStatus } from '@prisma/client'

/**
 * Mercado Pago IPN (Instant Payment Notification) webhook
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago sends different notification types
    // We care about "payment" type
    if (body.type === 'payment' || body.action === 'payment.updated') {
      const paymentId = body.data?.id || body.id

      if (!paymentId) {
        console.warn('Webhook received without payment ID:', body)
        return NextResponse.json({ received: true })
      }

      // Fetch payment details from Mercado Pago
      const payment = await getPaymentStatus(String(paymentId))

      if (!payment.externalReference) {
        console.warn('Payment has no external reference (bookingId):', paymentId)
        return NextResponse.json({ received: true })
      }

      const bookingId = payment.externalReference

      // Map Mercado Pago status to our PaymentStatus enum
      let paymentStatus: PaymentStatus
      switch (payment.status) {
        case 'approved':
          paymentStatus = PaymentStatus.PAID
          break
        case 'pending':
        case 'in_process':
        case 'authorized':
          paymentStatus = PaymentStatus.PENDING
          break
        case 'rejected':
        case 'cancelled':
          paymentStatus = PaymentStatus.CANCELLED
          break
        case 'refunded':
        case 'charged_back':
          paymentStatus = PaymentStatus.REFUNDED
          break
        default:
          paymentStatus = PaymentStatus.PENDING
      }

      // Update booking
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus,
          paymentId: String(paymentId),
        },
        include: {
          tourDate: { include: { tour: true } },
        },
      })

      // If payment approved, create commission
      if (paymentStatus === 'PAID') {
        const tour = booking.tourDate.tour
        const commissionRate = Number(tour.commissionRate)

        if (commissionRate > 0) {
          const operator = await prisma.user.findFirst({
            where: { role: 'OPERATOR' },
          })

          if (operator) {
            // Check if commission already exists
            const existingCommission = await prisma.commission.findFirst({
              where: { bookingId: booking.id },
            })

            if (!existingCommission) {
              await prisma.commission.create({
                data: {
                  bookingId: booking.id,
                  tourId: tour.id,
                  recipientId: operator.id,
                  amount: Number(booking.totalAmount) * commissionRate,
                  percentage: commissionRate * 100,
                  type: 'OPERATOR',
                },
              })
            }
          }
        }
      }

      console.log(`Webhook processed: payment ${paymentId} → booking ${bookingId} → ${paymentStatus}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Always return 200 to Mercado Pago so it doesn't retry indefinitely
    return NextResponse.json({ received: true })
  }
}

// Mercado Pago also sends GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
