import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { id } = await req.json() as { id:number }
    if (!id) return NextResponse.json({ ok:false, message:'ID requerido' }, { status:400 })

    const count = await prisma.product.count({ where:{ brandId:id } })
    if (count > 0) {
      return NextResponse.json(
        { ok:false, message:`No se puede eliminar: ${count} producto(s) usan esta marca` },
        { status:409 }
      )
    }

    await prisma.brand.delete({ where:{ id } })
    return NextResponse.json({ ok:true })
  } catch {
    return NextResponse.json({ ok:false, message:'Error al eliminar' }, { status:500 })
  }
}
