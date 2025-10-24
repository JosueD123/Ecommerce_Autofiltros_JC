import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ ok:false }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const productId = Number(searchParams.get('productId') ?? 0)
  if (!productId) return NextResponse.json({ ok:false, message:'productId requerido' }, { status:400 })

  const rows = await prisma.productFitment.findMany({
    where: { productId },
    include: {
      variant: { include: { model: { include: { make: true } } } }
    },
    orderBy: [
      { variant: { model: { make: { name: 'asc' } } } },
      { variant: { model: { name: 'asc' } } },
      { variant: { year: 'asc' } },
    ],
  })

  return NextResponse.json({ ok:true, rows })
}
