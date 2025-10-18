import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // mantiene tu firma con Promise
) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const orderId = Number(id)
  const o = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  })
  if (!o) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: o.id,
    email: o.email,
    total: Number(o.total),
    currency: o.currency,
    status: o.status,
    createdAt: o.createdAt,
    stripeId: o.stripeId,
    items: o.items.map(i => ({
      id: i.id, name: i.name, qty: i.qty, price: Number(i.price), productId: i.productId,
    })),
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const orderId = Number(id)
  const { status } = await req.json() as { status: 'PENDING'|'PAID'|'CANCELLED' }
  if (!['PENDING','PAID','CANCELLED'].includes(String(status))) {
    return NextResponse.json({ message: 'Estado inválido' }, { status: 400 })
  }
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
  return NextResponse.json({ ok: true, status: updated.status })
}


