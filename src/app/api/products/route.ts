import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: { images: true, brand: true, category: true }
    })
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  }

  const products = await prisma.product.findMany({
    include: { images: true, brand: true, category: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}


