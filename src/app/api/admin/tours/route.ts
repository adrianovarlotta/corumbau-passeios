import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { tourSchema } from '@/lib/validations'

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        tourDates: {
          where: {
            date: { gte: new Date() },
            status: 'OPEN',
          },
          orderBy: { date: 'asc' },
          take: 3,
        },
        _count: {
          select: { tourDates: true, commissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: tours, success: true })
  } catch (error) {
    console.error('Failed to fetch tours:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar passeios', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = tourSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten(), success: false },
        { status: 400 }
      )
    }

    const existing = await prisma.tour.findUnique({
      where: { slug: parsed.data.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ja existe um passeio com esse slug', success: false },
        { status: 409 }
      )
    }

    const tour = await prisma.tour.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        duration: parsed.data.duration,
        includes: parsed.data.includes,
        priceAdult: parsed.data.priceAdult,
        priceChild: parsed.data.priceChild,
        maxCapacity: parsed.data.maxCapacity,
        category: parsed.data.category,
        images: parsed.data.images,
        isActive: parsed.data.isActive,
        commissionRate: parsed.data.commissionRate,
      },
    })

    return NextResponse.json({ data: tour, success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to create tour:', error)
    return NextResponse.json(
      { error: 'Falha ao criar passeio', success: false },
      { status: 500 }
    )
  }
}
