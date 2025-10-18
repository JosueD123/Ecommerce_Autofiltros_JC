import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// 👇 Tipado compatible con App Router para el 2º argumento
type Ctx = { params: Record<string, string> }

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const me = await getSessionUser()
    if (!me) return NextResponse.json({ ok: false }, { status: 401 })

    const id = Number(params.id)
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: 'ID inválido' }, { status: 400 })
    }

    // Evita 'as any': borra sólo si pertenece al usuario
    const r = await prisma.address.deleteMany({
      where: { id, userId: me.id },
    })

    if (r.count === 0) {
      return NextResponse.json({ ok: false, message: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const me = await getSessionUser()
    if (!me) return NextResponse.json({ ok: false }, { status: 401 })

    const id = Number(params.id)
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: 'ID inválido' }, { status: 400 })
    }

    const { label, line1, line2, city, state, zip, phone } = await req.json()

    // Evita 'as any': actualiza sólo si pertenece al usuario
    const r = await prisma.address.updateMany({
      where: { id, userId: me.id },
      data: { label, line1, line2, city, state, zip, phone },
    })

    if (r.count === 0) {
      return NextResponse.json({ ok: false, message: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 })
  }
}

