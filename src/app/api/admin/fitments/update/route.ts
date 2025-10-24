import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const {
    fitmentId,
    // si solo querés editar notas, basta con enviar notes
    notes,
    // si además querés cambiar la variante (make/model/year/engine/body)
    makeName,
    modelName,
    year,
    engine,
    body: carBody,
  } = body || {}

  if (!fitmentId) {
    return NextResponse.json({ ok: false, message: 'Faltan campos requeridos' }, { status: 400 })
  }

  try {
    let newVariantId: number | undefined

    // ¿Pidieron cambiar la variante?
    if (makeName && modelName && Number.isFinite(Number(year))) {
      const mkName = String(makeName).trim()
      const mdName = String(modelName).trim()
      const yr = Number(year)
      const eng = engine?.toString().trim() || null
      const bod = carBody?.toString().trim() || null

      // upsert de marca y modelo
      const make = await prisma.vehicleMake.upsert({
        where: { name: mkName },
        update: {},
        create: { name: mkName },
      })
      const model = await prisma.vehicleModel.upsert({
        where: { makeId_name: { makeId: make.id, name: mdName } },
        update: {},
        create: { makeId: make.id, name: mdName },
      })

      // buscamos variante exacta; si no existe la creamos
      let variant = await prisma.vehicleVariant.findFirst({
        where: { modelId: model.id, year: yr, engine: eng, body: bod },
        select: { id: true },
      })
      if (!variant) {
        variant = await prisma.vehicleVariant.create({
          data: { modelId: model.id, year: yr, engine: eng, body: bod },
          select: { id: true },
        })
      }
      newVariantId = variant.id
    }

    const updated = await prisma.productFitment.update({
      where: { id: Number(fitmentId) },
      data: {
        ...(notes !== undefined ? { notes: notes ? String(notes) : null } : {}),
        ...(newVariantId ? { variantId: newVariantId } : {}),
      },
      include: {
        variant: { include: { model: { include: { make: true } } } },
      },
    })

    return NextResponse.json({ ok: true, fitment: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Error' }, { status: 500 })
  }
}
