import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Nombre, email y mensaje son requeridos' }, { status: 400 })
    }
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'Correo inválido' }, { status: 400 })
    }

    await prisma.contactMessage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        subject: subject ? String(subject).trim() : null,
        message: String(message).trim(),
      }
    })

    return NextResponse.json({ ok: true })
  } catch (e:any) {
    console.error('POST /api/contacto error:', e)
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 })
  }
}
