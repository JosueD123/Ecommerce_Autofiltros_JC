import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const orderId = Number(id)
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  })
  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({
    id: order.id,
    email: order.email,
    total: Number(order.total),
    currency: order.currency,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: Number(i.price) })),
  })
}
