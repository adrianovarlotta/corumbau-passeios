import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkoutSchema } from '@/lib/validations'
import { generateVoucherCode } from '@/lib/voucher'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = checkoutSchema.parse(body)

    // Validate availability
    const tourDate = await prisma.tourDate.findUnique({
      where: { id: parsed.tourDateId },
      include: { tour: true },
    })

    if (!tourDate) {
      return NextResponse.json({ error: 'Data não encontrada', success: false }, { status: 404 })
    }

    if (tourDate.status !== 'OPEN') {
      return NextResponse.json({ error: 'Data não disponível para reservas', success: false }, { status: 400 })
    }

    const totalPeople = parsed.adults + parsed.children
    const availableSlots = tourDate.totalSlots - tourDate.bookedSlots

    if (totalPeople > availableSlots) {
      return NextResponse.json({
        error: `Apenas ${availableSlots} vaga${availableSlots !== 1 ? 's' : ''} disponível${availableSlots !== 1 ? 'is' : ''}`,
        success: false,
      }, { status: 400 })
    }

    // Calculate total
    const priceAdult = Number(tourDate.tour.priceAdult)
    const priceChild = Number(tourDate.tour.priceChild ?? 0)
    const totalAmount = (parsed.adults * priceAdult) + (parsed.children * priceChild)

    // Generate unique voucher code
    let voucherCode = generateVoucherCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.booking.findUnique({ where: { voucherCode } })
      if (!existing) break
      voucherCode = generateVoucherCode()
      attempts++
    }

    // Create booking in transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const booking = await prisma.$transaction(async (tx: any) => {
      const newBooking = await tx.booking.create({
        data: {
          tourDateId: parsed.tourDateId,
          customerName: parsed.customerName,
          customerEmail: parsed.customerEmail,
          customerPhone: parsed.customerPhone,
          adults: parsed.adults,
          children: parsed.children,
          unitPriceAdult: priceAdult,
          unitPriceChild: priceChild,
          totalAmount,
          paymentMethod: parsed.paymentMethod,
          source: 'ONLINE',
          voucherCode,
          partnerCode: parsed.partnerCode || null,
        },
      })

      // Update booked slots
      await tx.tourDate.update({
        where: { id: parsed.tourDateId },
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
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Dados inválidos', success: false }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar reserva', success: false }, { status: 500 })
  }
}
