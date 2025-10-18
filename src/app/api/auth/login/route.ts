import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 })
    }

    const u = await prisma.user.findUnique({ where: { email } })
    if (!u) return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })

    const ok = await bcrypt.compare(password, u.passwordHash)
    if (!ok) return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })

    // Guarda la cookie app_session (JWT) por 7 días
    await setSessionCookie({ id: u.id, role: u.role })

    return NextResponse.json({
      ok: true,
      user: { id: u.id, name: u.name, email: u.email, role: u.role },
    })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}



