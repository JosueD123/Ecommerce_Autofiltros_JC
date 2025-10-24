import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { id, name } = await req.json() as { id:number; name:string }
    if (!id || !name?.trim()) return NextResponse.json({ ok:false, message:'Nombre requerido' }, { status:400 })

    const brand = await prisma.brand.update({ where:{ id }, data:{ name: name.trim() } })
    return NextResponse.json({ ok:true, brand })
  } catch (e:any) {
    // unique name
    if (String(e?.code) === 'P2002') {
      return NextResponse.json({ ok:false, message:'Ya existe una marca con ese nombre' }, { status:409 })
    }
    return NextResponse.json({ ok:false, message:'Error al actualizar' }, { status:500 })
  }
}
