// src/app/api/fitments/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const make = searchParams.get('make') ?? ''
  const model = searchParams.get('model') ?? ''
  const year = Number(searchParams.get('year') ?? 0)

  if (!make || !model || !year) {
    return NextResponse.json({ ok:false, message:'Parámetros make, model, year requeridos' }, { status:400 })
  }

  const products = await prisma.product.findMany({
    where: {
      fitments: {
        some: {
          variant: {
            year,
            model: {
              name: model,
              make: { name: make }
            }
          }
        }
      }
    },
    include: { brand:true, category:true, images:true }
  })

  return NextResponse.json({ ok:true, count: products.length, products })
}
