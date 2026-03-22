import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json(
        { error: 'Código do voucher é obrigatório', success: false },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { voucherCode: code.toUpperCase() },
      include: {
        tourDate: {
          include: { tour: true },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Voucher não encontrado', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        adults: booking.adults,
        children: booking.children,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        voucherCode: booking.voucherCode,
        checkedInAt: booking.checkedInAt,
        tourDate: {
          id: booking.tourDate.id,
          date: booking.tourDate.date,
          time: booking.tourDate.time,
          tour: {
            id: booking.tourDate.tour.id,
            name: booking.tourDate.tour.name,
            category: booking.tourDate.tour.category,
          },
        },
      },
      success: true,
    })
  } catch (error) {
    console.error('Failed to lookup voucher:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar voucher', success: false },
      { status: 500 }
    )
  }
}
