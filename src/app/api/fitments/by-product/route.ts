// src/app/api/fitments/by-product/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ Endpoint público para obtener compatibilidades de un producto
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pid = Number(searchParams.get('pid') || '')
    if (!Number.isFinite(pid)) {
      return NextResponse.json({ ok: false, message: 'pid inválido' }, { status: 400 })
    }

    const rows = await prisma.productFitment.findMany({
      where: { productId: pid },
      include: {
        variant: {
          select: {
            year: true,
            engine: true,
            body: true,
            model: {
              select: { name: true, make: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: [
        { variant: { model: { make: { name: 'asc' } } } },
        { variant: { model: { name: 'asc' } } },
        { variant: { year: 'desc' } },
      ],
    })

    return NextResponse.json({
      ok: true,
      items: rows.map((r) => ({
        make: r.variant.model.make.name,
        model: r.variant.model.name,
        year: r.variant.year,
        engine: r.variant.engine,
        body: r.variant.body,
        notes: r.notes ?? null,
      })),
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || 'Error interno' },
      { status: 500 }
    )
  }
}
