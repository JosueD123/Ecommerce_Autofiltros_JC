import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const me = await getSessionUser().catch(() => null)
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ ok: false, message: 'JSON inválido' }, { status: 400 })
    }

    const { productId, make, model, year, engine, body: carroceria, notes } = body

    if (!productId || !make || !model || !year) {
      return NextResponse.json({ ok: false, message: 'Faltan campos requeridos' }, { status: 400 })
    }

    const yearN = Number(year)
    if (!Number.isFinite(yearN)) {
      return NextResponse.json({ ok: false, message: 'Año inválido' }, { status: 400 })
    }

    const engineV = (engine ?? '').trim()
    const bodyV   = (carroceria ?? '').trim()

    const mk = await prisma.vehicleMake.upsert({
      where: { name: make.trim() },
      update: {},
      create: { name: make.trim() },
    })

    const mdl = await prisma.vehicleModel.upsert({
      where: { makeId_name: { makeId: mk.id, name: model.trim() } },
      update: {},
      create: { makeId: mk.id, name: model.trim() },
    })

    // IMPORTANTE: siempre pasar los 4 campos del índice único
    const variant = await prisma.vehicleVariant.upsert({
      where: {
        modelId_year_engine_body: {
          modelId: mdl.id,
          year: yearN,
          engine: engineV,
          body: bodyV,
        },
      },
      update: {},
      create: {
        modelId: mdl.id,
        year: yearN,
        engine: engineV,
        body: bodyV,
      },
    })

    await prisma.productFitment.upsert({
      where: {
        productId_variantId: { productId: Number(productId), variantId: variant.id },
      },
      update: { notes: notes?.trim() || undefined },
      create: {
        productId: Number(productId),
        variantId: variant.id,
        notes: notes?.trim() || undefined,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('fitments/add error:', err)
    // Devolve siempre JSON para evitar el “Unexpected end of JSON”
    return NextResponse.json({ ok: false, message: err?.message || 'Server error' }, { status: 500 })
  }
}
