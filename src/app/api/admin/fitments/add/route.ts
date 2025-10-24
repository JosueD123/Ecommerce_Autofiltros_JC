import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ ok:false }, { status: 403 })

  const { productId, makeName, modelName, year, engine, body, notes } = await req.json()

  if (!productId || !makeName || !modelName || !year) {
    return NextResponse.json({ ok:false, message:'productId, makeName, modelName, year requeridos' }, { status:400 })
  }

  // upserts en cascada
  const make = await prisma.vehicleMake.upsert({
    where: { name: makeName.trim() },
    update: {},
    create: { name: makeName.trim() }
  })

  const model = await prisma.vehicleModel.upsert({
    where: { makeId_name: { makeId: make.id, name: modelName.trim() } },
    update: {},
    create: { makeId: make.id, name: modelName.trim() }
  })

  const variant = await prisma.vehicleVariant.upsert({
    where: { modelId_year_engine_body: { modelId: model.id, year: Number(year), engine: engine ?? null, body: body ?? null } },
    update: {},
    create: { modelId: model.id, year: Number(year), engine: engine ?? null, body: body ?? null }
  })

  const fit = await prisma.productFitment.upsert({
    where: { productId_variantId: { productId: Number(productId), variantId: variant.id } },
    update: { notes: notes ?? null },
    create: { productId: Number(productId), variantId: variant.id, notes: notes ?? null }
  })

  return NextResponse.json({ ok:true, fitmentId: fit.id })
}
