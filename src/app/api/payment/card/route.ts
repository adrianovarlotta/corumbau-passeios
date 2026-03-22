import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createCheckoutPreference } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required', success: false }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tourDate: { include: { tour: true } } },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Reserva não encontrada', success: false }, { status: 404 })
    }

    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Pagamento já confirmado', success: false }, { status: 400 })
    }

    const result = await createCheckoutPreference(
      Number(booking.totalAmount),
      booking.id,
      booking.tourDate.tour.name,
      booking.customerEmail,
      booking.customerName,
    )

    return NextResponse.json({
      data: {
        preferenceId: result.preferenceId,
        initPoint: result.initPoint,
        sandboxInitPoint: result.sandboxInitPoint,
      },
      success: true,
    })
  } catch (error) {
    console.error('Failed to create checkout preference:', error)
    return NextResponse.json({ error: 'Erro ao criar pagamento por cartão', success: false }, { status: 500 })
  }
}
