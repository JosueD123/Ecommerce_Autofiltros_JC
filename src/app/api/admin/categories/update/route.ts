import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  try {
    const { id, name } = await req.json() as { id:number; name:string }
    if (!id || !name?.trim()) return NextResponse.json({ ok:false, message:'Nombre requerido' }, { status:400 })

    const data = { name: name.trim(), slug: slugify(name) }
    const category = await prisma.category.update({ where:{ id }, data })
    return NextResponse.json({ ok:true, category })
  } catch (e:any) {
    if (String(e?.code) === 'P2002') {
      return NextResponse.json({ ok:false, message:'Ya existe una categoría con ese nombre/slug' }, { status:409 })
    }
    return NextResponse.json({ ok:false, message:'Error al actualizar' }, { status:500 })
  }
}
