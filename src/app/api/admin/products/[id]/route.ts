import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/api-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()

    const {
      id: _omitId,
      createdAt: _omitCreatedAt,
      OrderItem: _omitOrderItem,
      images,
      brand, category,
      brandId, categoryId,
      ...rest
    } = body

    const data: any = {
      ...rest,
      price: Number(rest.price ?? 0),
      cost: Number(rest.cost ?? 0),
      stock: Number(rest.stock ?? 0),
    }

    if (brandId) data.brand = { connect: { id: Number(brandId) } }
    else if (brand?.id) data.brand = { connect: { id: Number(brand.id) } }

    if (categoryId) data.category = { connect: { id: Number(categoryId) } }
    else if (category?.id) data.category = { connect: { id: Number(category.id) } }

    const productId = Number(id)

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.product.update({ where: { id: productId }, data })

      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId } })
        const rows = images
          .filter((i: any) => i?.url)
          .map((i: any) => ({
            url: String(i.url),
            isPrimary: !!i.isPrimary,
            productId,
          }))
        if (rows.length) await tx.productImage.createMany({ data: rows })
      }
    })

    const result = await prisma.product.findUnique({
      where: { id: productId },
      include: { brand: true, category: true, images: true },
    })

    return NextResponse.json(result)
  } catch (e: any) {
    console.error('PUT /api/admin/products/[id] error:', e)
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}







