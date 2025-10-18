import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()
  const status = url.searchParams.get('status') || ''
  const page = Math.max(1, Number(url.searchParams.get('page') || '1') || 1)

  const where: any = {}
  if (status && ['PENDING','PAID','CANCELLED'].includes(status)) where.status = status
  if (q) {
    where.OR = [
      { email:   { contains: q } },
      { stripeId:{ contains: q } },
      { id: Number.isFinite(Number(q)) ? Number(q) : undefined } as any,
    ].filter(Boolean)
  }

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.order.count({ where: Object.keys(where).length ? where : undefined }),
  ])

  return NextResponse.json({
    total,
    page,
    pageSize: PAGE_SIZE,
    rows: rows.map(o => ({
      id: o.id,
      email: o.email,
      total: Number(o.total),
      currency: o.currency,
      status: o.status,
      createdAt: o.createdAt,
      stripeId: o.stripeId,
      itemsCount: o.items.length,
    })),
  })
}

