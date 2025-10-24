import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const me = await getSessionUser().catch(() => null)
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, message: 'No autorizado' }, { status: 401 })
    }

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, message: 'JSON inválido' }, { status: 400 })
    }

    // Normalización fuerte
    const productId = Number(body?.productId)
    const makeName = String(body?.makeName ?? '').trim()
    const modelName = String(body?.modelName ?? '').trim()
    const year = Number(body?.year)

    // engine/body pueden venir vacíos: los dejamos undefined para omitirlos en filtros
    const engine = (body?.engine ?? '').toString().trim() || undefined
    const bdy    = (body?.body ?? '').toString().trim() || undefined
    const notes  = (body?.notes ?? '').toString().trim() || undefined

    if (!Number.isFinite(productId) || !productId || !makeName || !modelName || !Number.isFinite(year)) {
      return NextResponse.json({ ok: false, message: 'Faltan campos requeridos' }, { status: 400 })
    }

    // …(lo demás igual)…

    const make = await prisma.vehicleMake.upsert({
      where: { name: makeName },
      update: {},
      create: { name: makeName },
      select: { id: true }
    })

    const model = await prisma.vehicleModel.upsert({
      where: { makeId_name: { makeId: make.id, name: modelName } },
      update: {},
      create: { makeId: make.id, name: modelName },
      select: { id: true }
    })

    // WHERE sin incluir campos vacíos
    const whereVariant: any = { modelId: model.id, year }
    if (engine !== undefined) whereVariant.engine = engine
    if (bdy    !== undefined) whereVariant.body   = bdy

    let variant = await prisma.vehicleVariant.findFirst({
      where: whereVariant,
      select: { id: true },
    })

    if (!variant) {
      variant = await prisma.vehicleVariant.create({
        data: {
          modelId: model.id,
          year,
          ...(engine !== undefined ? { engine } : {}),
          ...(bdy    !== undefined ? { body: bdy } : {}),
        },
        select: { id: true },
      })
    }

    await prisma.productFitment.upsert({
      where: { productId_variantId: { productId, variantId: variant.id } },
      update: { notes: notes ?? null },
      create: { productId, variantId: variant.id, notes: notes ?? null },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('fitment add error:', err)
    return NextResponse.json({ ok: false, message: err?.message || 'Error' }, { status: 500 })
  }
}
