import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

function toSlug(s: string) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(_req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  const n = String(name ?? '').trim()
  if (!n) return NextResponse.json({ message: 'Nombre requerido' }, { status: 400 })

  const slug = toSlug(n)
  const created = await prisma.category.create({ data: { name: n, slug } })
  return NextResponse.json(created, { status: 201 })
}


