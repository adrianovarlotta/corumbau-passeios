import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const tours = await prisma.tour.findMany({
      where: {
        isActive: true,
        ...(category && category !== 'ALL' ? { category: category as 'BOAT' | 'BUGGY' | 'WHALE' | 'EXPERIENCE' } : {}),
      },
      include: {
        tourDates: {
          where: {
            date: { gte: new Date() },
            status: 'OPEN',
          },
          orderBy: { date: 'asc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: tours, success: true })
  } catch (error) {
    console.error('Failed to fetch tours:', error)
    return NextResponse.json({ error: 'Failed to fetch tours', success: false }, { status: 500 })
  }
}
