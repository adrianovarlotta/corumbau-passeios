import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // 'paid' | 'pending' | null

  try {
    const commissions = await prisma.commission.findMany({
      where: {
        ...(status === 'paid' ? { isPaid: true } : {}),
        ...(status === 'pending' ? { isPaid: false } : {}),
      },
      include: {
        booking: {
          select: { customerName: true, voucherCode: true },
        },
        tour: {
          select: { name: true },
        },
        recipient: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: commissions, success: true })
  } catch (error) {
    console.error('Failed to fetch commissions:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar comissoes', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs das comissoes sao obrigatorios', success: false },
        { status: 400 }
      )
    }

    await prisma.commission.updateMany({
      where: { id: { in: ids } },
      data: { isPaid: true, paidAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update commissions:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar comissoes', success: false },
      { status: 500 }
    )
  }
}
