import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ ok: false }, { status: 401 })
  const id = Number(params.id)
  await prisma.address.delete({ where: { id, userId: me.id } as any })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ ok: false }, { status: 401 })
  const id = Number(params.id)
  const { label, line1, line2, city, state, zip, phone } = await req.json()
  await prisma.address.update({
    where: { id, userId: me.id } as any,
    data: { label, line1, line2, city, state, zip, phone },
  })
  return NextResponse.json({ ok: true })
}
