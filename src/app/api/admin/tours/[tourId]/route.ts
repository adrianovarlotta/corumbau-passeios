import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { tourSchema } from '@/lib/validations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params

  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        tourDates: {
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { tourDates: true, commissions: true },
        },
      },
    })

    if (!tour) {
      return NextResponse.json(
        { error: 'Passeio nao encontrado', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: tour, success: true })
  } catch (error) {
    console.error('Failed to fetch tour:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar passeio', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params

  try {
    const body = await request.json()
    const parsed = tourSchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten(), success: false },
        { status: 400 }
      )
    }

    const tour = await prisma.tour.update({
      where: { id: tourId },
      data: parsed.data,
    })

    return NextResponse.json({ data: tour, success: true })
  } catch (error) {
    console.error('Failed to update tour:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar passeio', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params

  try {
    await prisma.tour.delete({
      where: { id: tourId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete tour:', error)
    return NextResponse.json(
      { error: 'Falha ao excluir passeio', success: false },
      { status: 500 }
    )
  }
}
