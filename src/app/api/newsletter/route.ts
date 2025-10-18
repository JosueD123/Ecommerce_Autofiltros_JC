// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

function normalizeEmail(raw: unknown) {
  const email = String(raw ?? '').trim().toLowerCase()
  return email
}

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json()
    const email = normalizeEmail(rawEmail)

    // Validación simple
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Correo inválido' }, { status: 400 })
    }

    // Intenta crear (email único)
    await prisma.newsletter.create({ data: { email } })

    return NextResponse.json({ message: '¡Gracias por suscribirte!' }, { status: 201 })
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      // Duplicado
      return NextResponse.json({ message: 'Este correo ya está suscrito.' }, { status: 409 })
    }
    console.error('POST /api/newsletter error:', e)
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 })
  }
}

