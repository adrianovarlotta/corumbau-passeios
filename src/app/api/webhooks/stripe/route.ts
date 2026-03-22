import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { sendVoucherEmail } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const bookingId = paymentIntent.metadata.bookingId

      if (!bookingId) {
        console.error('No bookingId in payment intent metadata')
        break
      }

      // Update booking status
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'PAID',
          paymentId: paymentIntent.id,
        },
        include: {
          tourDate: {
            include: { tour: true },
          },
        },
      })

      // Calculate and create commission
      const tour = booking.tourDate.tour
      const commissionRate = Number(tour.commissionRate)
      if (commissionRate > 0) {
        // Find operator for this tour (simplified — in production, assign per TourDate)
        const operator = await prisma.user.findFirst({
          where: { role: 'OPERATOR' },
        })
        if (operator) {
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

      // Send voucher email
      try {
        await sendVoucherEmail({
          to: booking.customerEmail,
          customerName: booking.customerName,
          tourName: tour.name,
          date: booking.tourDate.date.toLocaleDateString('pt-BR'),
          time: booking.tourDate.time,
          adults: booking.adults,
          children: booking.children,
          voucherCode: booking.voucherCode,
          totalAmount: Number(booking.totalAmount),
          bookingId: booking.id,
        })
      } catch (emailErr) {
        console.error('Failed to send voucher email:', emailErr)
      }

      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id

      if (paymentIntentId) {
        await prisma.booking.updateMany({
          where: { paymentId: paymentIntentId },
          data: { paymentStatus: 'REFUNDED' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
