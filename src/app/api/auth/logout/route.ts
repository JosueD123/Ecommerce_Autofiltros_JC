import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // JWT del login público (si los usas):
  res.cookies.set('accessToken',  '', { path: '/', maxAge: 0 })
  res.cookies.set('refreshToken', '', { path: '/', maxAge: 0 })
  // Cookie de sesión del sitio:
  await clearSessionCookie()
  return res
}


