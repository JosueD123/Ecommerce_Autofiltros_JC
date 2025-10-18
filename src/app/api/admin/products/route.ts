import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { requireAdmin } from '@/lib/api-auth'

function toSlug(s: string){
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
          .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

export async function GET(_req: NextRequest){
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({ include:{ brand:true, category:true, images:true } })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest){
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try{
    const raw = await req.json()
    const data = {
      name: String(raw.name ?? '').trim(),
      slug: String(raw.slug ?? '').trim(),
      sku: String(raw.sku ?? '').trim(),
      price: Number(raw.price ?? 0),
      cost: Number(raw.cost ?? 0),
      stock: Number(raw.stock ?? 0),
      brandId: Number(raw.brandId ?? 0),
      categoryId: Number(raw.categoryId ?? 0),
      description: raw.description ? String(raw.description) : null
    }
    if (!data.name) throw new Error('Nombre requerido')
    if (!data.sku) throw new Error('SKU requerido')
    if (!data.brandId || !data.categoryId) throw new Error('brandId y categoryId son requeridos')
    if (!data.slug) data.slug = toSlug(data.name)

    const created = await prisma.product.create({ data })
    return NextResponse.json(created, { status: 201 })
  }catch(e:any){
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') return NextResponse.json({ message: 'Slug o SKU ya existe' }, { status: 400 })
      if (e.code === 'P2003') return NextResponse.json({ message: 'Brand o Category no existen (FK inválida)' }, { status: 400 })
    }
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}



