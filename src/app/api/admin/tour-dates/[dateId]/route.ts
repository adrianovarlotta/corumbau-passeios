import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cancelDateSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dateId: string }> }
) {
  const { dateId } = await params

  try {
    const body = await request.json()

    // Handle cancellation
    if (body.action === 'cancel') {
      const parsed = cancelDateSchema.safeParse(body)

      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Dados invalidos', details: parsed.error.flatten(), success: false },
          { status: 400 }
        )
      }

      const reason =
        parsed.data.reason === 'Outro' && parsed.data.customReason
          ? parsed.data.customReason
          : parsed.data.reason

      const tourDate = await prisma.tourDate.update({
        where: { id: dateId },
        data: {
          status: 'CANCELLED',
          cancelReason: reason,
          cancelledAt: new Date(),
        },
      })

      return NextResponse.json({ data: tourDate, success: true })
    }

    // Handle general update (e.g. change totalSlots)
    const updateData: Record<string, unknown> = {}
    if (body.totalSlots !== undefined) updateData.totalSlots = body.totalSlots
    if (body.time !== undefined) updateData.time = body.time

    const tourDate = await prisma.tourDate.update({
      where: { id: dateId },
      data: updateData,
    })

    return NextResponse.json({ data: tourDate, success: true })
  } catch (error) {
    console.error('Failed to update tour date:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar data', success: false },
      { status: 500 }
    )
  }
}
