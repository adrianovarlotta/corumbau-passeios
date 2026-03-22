import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { voucherCode, operatorId } = await request.json()

    if (!voucherCode) {
      return NextResponse.json({ error: 'Código do voucher é obrigatório', success: false }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { voucherCode: voucherCode.toUpperCase() },
      include: {
        tourDate: { include: { tour: true } },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Voucher não encontrado', success: false }, { status: 404 })
    }

    if (booking.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: 'Pagamento não confirmado', success: false }, { status: 400 })
    }

    if (booking.checkedInAt) {
      return NextResponse.json({
        error: `Já embarcado às ${booking.checkedInAt.toLocaleTimeString('pt-BR')}`,
        success: false,
      }, { status: 409 })
    }

    // Check if tour date is today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tourDate = new Date(booking.tourDate.date)
    tourDate.setHours(0, 0, 0, 0)

    if (tourDate.getTime() !== today.getTime()) {
      return NextResponse.json({
        error: `Voucher válido para ${booking.tourDate.date.toLocaleDateString('pt-BR')}, não para hoje`,
        success: false,
      }, { status: 400 })
    }

    // Perform check-in
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        checkedInAt: new Date(),
        checkedInBy: operatorId || null,
      },
      include: {
        tourDate: { include: { tour: true } },
      },
    })

    return NextResponse.json({
      data: {
        id: updated.id,
        customerName: updated.customerName,
        adults: updated.adults,
        children: updated.children,
        tourName: updated.tourDate.tour.name,
        voucherCode: updated.voucherCode,
        checkedInAt: updated.checkedInAt,
      },
      success: true,
    })
  } catch (error) {
    console.error('Failed to check in:', error)
    return NextResponse.json({ error: 'Erro ao realizar check-in', success: false }, { status: 500 })
  }
}
