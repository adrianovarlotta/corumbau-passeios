import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tourDateId = searchParams.get('tourDateId')

    if (!tourDateId) {
      return NextResponse.json(
        { error: 'tourDateId é obrigatório', success: false },
        { status: 400 }
      )
    }

    const tourDate = await prisma.tourDate.findUnique({
      where: { id: tourDateId },
      include: { tour: true },
    })

    if (!tourDate) {
      return NextResponse.json(
        { error: 'Data de passeio não encontrada', success: false },
        { status: 404 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        tourDateId,
        paymentStatus: 'PAID',
      },
      orderBy: [
        { checkedInAt: { sort: 'asc', nulls: 'last' } },
        { customerName: 'asc' },
      ],
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        adults: true,
        children: true,
        voucherCode: true,
        checkedInAt: true,
        checkedInBy: true,
        notes: true,
      },
    })

    return NextResponse.json({
      data: {
        tourDate: {
          id: tourDate.id,
          date: tourDate.date,
          time: tourDate.time,
          totalSlots: tourDate.totalSlots,
          bookedSlots: tourDate.bookedSlots,
          status: tourDate.status,
          tour: {
            id: tourDate.tour.id,
            name: tourDate.tour.name,
            category: tourDate.tour.category,
          },
        },
        bookings,
      },
      success: true,
    })
  } catch (error) {
    console.error('Failed to fetch manifest:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar manifest', success: false },
      { status: 500 }
    )
  }
}
