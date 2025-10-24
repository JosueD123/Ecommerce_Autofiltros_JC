import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ ok:false }, { status: 403 })

  const { fitmentId } = await req.json()
  if (!fitmentId) return NextResponse.json({ ok:false, message:'fitmentId requerido' }, { status:400 })

  await prisma.productFitment.delete({ where: { id: Number(fitmentId) } })
  return NextResponse.json({ ok:true })
}
