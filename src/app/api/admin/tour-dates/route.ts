import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { tourDateSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tourId = searchParams.get('tourId')

  try {
    const tourDates = await prisma.tourDate.findMany({
      where: {
        ...(tourId ? { tourId } : {}),
      },
      include: {
        tour: { select: { name: true, slug: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ data: tourDates, success: true })
  } catch (error) {
    console.error('Failed to fetch tour dates:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar datas', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = tourDateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten(), success: false },
        { status: 400 }
      )
    }

    const tour = await prisma.tour.findUnique({
      where: { id: parsed.data.tourId },
    })

    if (!tour) {
      return NextResponse.json(
        { error: 'Passeio nao encontrado', success: false },
        { status: 404 }
      )
    }

    const tourDate = await prisma.tourDate.create({
      data: {
        tourId: parsed.data.tourId,
        date: new Date(parsed.data.date),
        time: parsed.data.time,
        totalSlots: parsed.data.totalSlots,
      },
    })

    return NextResponse.json({ data: tourDate, success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to create tour date:', error)
    return NextResponse.json(
      { error: 'Falha ao criar data', success: false },
      { status: 500 }
    )
  }
}
