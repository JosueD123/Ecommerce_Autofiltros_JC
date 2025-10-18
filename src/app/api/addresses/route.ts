import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ ok: false }, { status: 401 })
  const addresses = await prisma.address.findMany({
    where: { userId: me.id },
    orderBy: { id: 'desc' },
  })
  return NextResponse.json({ ok: true, addresses })
}

export async function POST(req: NextRequest) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ ok: false }, { status: 401 })
  const { label, line1, line2, city, state, zip, phone } = await req.json()
  if (!line1 || !city) {
    return NextResponse.json({ ok: false, message: 'Faltan campos obligatorios' }, { status: 400 })
  }
  await prisma.address.create({
    data: { userId: me.id, label, line1, line2, city, state, zip, phone },
  })
  return NextResponse.json({ ok: true })
}
