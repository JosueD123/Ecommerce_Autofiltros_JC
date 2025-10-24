import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ ok:false }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const scope = searchParams.get('scope') // 'makes' | 'models' | 'variants' | 'products'
  const makeId = Number(searchParams.get('makeId') ?? 0)
  const modelId = Number(searchParams.get('modelId') ?? 0)

  if (scope === 'makes') {
    const makes = await prisma.vehicleMake.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ ok:true, makes })
  }

  if (scope === 'models') {
    if (!makeId) return NextResponse.json({ ok:false, message:'makeId requerido' }, { status:400 })
    const models = await prisma.vehicleModel.findMany({
      where: { makeId }, orderBy: { name: 'asc' }
    })
    return NextResponse.json({ ok:true, models })
  }

  if (scope === 'variants') {
    if (!modelId) return NextResponse.json({ ok:false, message:'modelId requerido' }, { status:400 })
    const variants = await prisma.vehicleVariant.findMany({
      where: { modelId }, orderBy: [{ year: 'asc' }, { engine:'asc' }, { body:'asc' }]
    })
    return NextResponse.json({ ok:true, variants })
  }

  if (scope === 'products') {
    const products = await prisma.product.findMany({
      select: { id:true, sku:true, name:true },
      orderBy: { name:'asc' }
    })
    return NextResponse.json({ ok:true, products })
  }

  return NextResponse.json({ ok:false, message:'scope inválido' }, { status:400 })
}
