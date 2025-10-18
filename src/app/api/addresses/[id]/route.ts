// src/app/api/addresses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

// 👈 En Next 15, params es Promise<{ id: string }>
type Ctx = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const me = await getSessionUser()
    if (!me) return NextResponse.json({ ok: false }, { status: 401 })

    const { id: idStr } = await params
    const id = Number(idStr)
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: 'ID inválido' }, { status: 400 })
    }

    // Borra solo si es del usuario (sin `as any`)
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

    const { id: idStr } = await params
    const id = Number(idStr)
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, message: 'ID inválido' }, { status: 400 })
    }

    const { label, line1, line2, city, state, zip, phone } = await req.json()

    // Actualiza solo si es del usuario (sin `as any`)
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


