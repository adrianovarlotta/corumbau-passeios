import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')

  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required', success: false }, { status: 400 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { paymentStatus: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Reserva não encontrada', success: false }, { status: 404 })
    }

    return NextResponse.json({
      data: { status: booking.paymentStatus },
      success: true,
    })
  } catch (error) {
    console.error('Failed to check payment status:', error)
    return NextResponse.json({ error: 'Erro ao verificar status', success: false }, { status: 500 })
  }
}
