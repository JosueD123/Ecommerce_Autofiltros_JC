// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Monthly = { month: string; total: number }

export async function GET() {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ ok: false }, { status: 403 })
  }

  // Últimos 6 meses
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  // Ventas pagadas en el rango
  const paidOrders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      createdAt: { gte: from }
    },
    select: { total: true, createdAt: true }
  })

  // Agregamos por mes (YYYY-MM)
  const byMonth = new Map<string, number>()
  for (let i = 0; i < 6; i++) {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth.set(key, 0)
  }
  for (const o of paidOrders) {
    const d = o.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(o.total))
  }
  const monthly: Monthly[] = Array.from(byMonth.entries()).map(([month, total]) => ({ month, total }))

  // Top 5 productos por cantidad vendida
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId', 'name'],
    _sum: { qty: true, price: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: 5
  })

  // Total clientes
  const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } })

  // Últimos pedidos (10)
  const lastOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { user: true }
  })

  return NextResponse.json({
    ok: true,
    monthly,
    topProducts: topProducts.map(tp => ({
      productId: tp.productId,
      name: tp.name,
      qty: tp._sum.qty ?? 0
    })),
    totalCustomers,
    lastOrders: lastOrders.map(o => ({
      id: o.id,
      email: o.email,
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
      userName: o.user?.name ?? null
    }))
  })
}
