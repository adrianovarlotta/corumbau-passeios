import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPixPaymentIntent } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')

  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required', success: false }, { status: 400 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Reserva não encontrada', success: false }, { status: 404 })
    }

    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Pagamento já confirmado', success: false }, { status: 400 })
    }

    // Create Stripe Payment Intent with Pix
    const paymentIntent = await createPixPaymentIntent(
      Number(booking.totalAmount),
      booking.id,
      booking.customerEmail,
    )

    // Update booking with payment ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentId: paymentIntent.id },
    })

    // Pix data from payment intent
    const pixAction = paymentIntent.next_action?.pix_display_qr_code

    return NextResponse.json({
      data: {
        clientSecret: paymentIntent.client_secret,
        qrCode: pixAction?.image_url_png || null,
        code: pixAction?.data || null,
        expiresAt: pixAction?.expires_at
          ? new Date(pixAction.expires_at * 1000).toISOString()
          : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min default
      },
      success: true,
    })
  } catch (error) {
    console.error('Failed to create Pix payment:', error)
    return NextResponse.json({ error: 'Erro ao gerar pagamento Pix', success: false }, { status: 500 })
  }
}
