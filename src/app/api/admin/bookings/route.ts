import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { offlineBookingSchema } from '@/lib/validations'

function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tourDateId = searchParams.get('tourDateId')
  const status = searchParams.get('status')

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(tourDateId ? { tourDateId } : {}),
        ...(status ? { paymentStatus: status as 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED' } : {}),
      },
      include: {
        tourDate: {
          include: {
            tour: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: bookings, success: true })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar reservas', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = offlineBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten(), success: false },
        { status: 400 }
      )
    }

    const tourDate = await prisma.tourDate.findUnique({
      where: { id: parsed.data.tourDateId },
      include: { tour: true },
    })

    if (!tourDate) {
      return NextResponse.json(
        { error: 'Data do passeio nao encontrada', success: false },
        { status: 404 }
      )
    }

    const totalPeople = parsed.data.adults + (parsed.data.children ?? 0)
    const available = tourDate.totalSlots - tourDate.bookedSlots

    if (totalPeople > available) {
      return NextResponse.json(
        { error: `Apenas ${available} vagas disponiveis`, success: false },
        { status: 400 }
      )
    }

    let voucherCode = generateVoucherCode()
    let existing = await prisma.booking.findUnique({ where: { voucherCode } })
    while (existing) {
      voucherCode = generateVoucherCode()
      existing = await prisma.booking.findUnique({ where: { voucherCode } })
    }

    const priceAdult = Number(tourDate.tour.priceAdult)
    const priceChild = Number(tourDate.tour.priceChild ?? 0)
    const totalAmount = parsed.data.adults * priceAdult + (parsed.data.children ?? 0) * priceChild

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          tourDateId: parsed.data.tourDateId,
          customerName: parsed.data.customerName,
          customerEmail: parsed.data.customerEmail || '',
          customerPhone: parsed.data.customerPhone,
          adults: parsed.data.adults,
          children: parsed.data.children ?? 0,
          unitPriceAdult: priceAdult,
          unitPriceChild: priceChild,
          totalAmount,
          paymentStatus: parsed.data.amountPaid >= totalAmount ? 'PAID' : 'PENDING',
          paymentMethod: parsed.data.paymentMethod,
          source: 'OFFLINE',
          voucherCode,
          notes: parsed.data.notes,
        },
      })

      await tx.tourDate.update({
        where: { id: parsed.data.tourDateId },
        data: {
          bookedSlots: { increment: totalPeople },
          status: tourDate.bookedSlots + totalPeople >= tourDate.totalSlots ? 'FULL' : 'OPEN',
        },
      })

      return newBooking
    })

    return NextResponse.json({ data: booking, success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { error: 'Falha ao criar reserva', success: false },
      { status: 500 }
    )
  }
}
