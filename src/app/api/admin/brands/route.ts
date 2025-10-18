import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

export async function GET(_req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  const n = String(name ?? '').trim()
  if (!n) return NextResponse.json({ message: 'Nombre requerido' }, { status: 400 })
  const created = await prisma.brand.create({ data: { name: n } })
  return NextResponse.json(created, { status: 201 })
}


