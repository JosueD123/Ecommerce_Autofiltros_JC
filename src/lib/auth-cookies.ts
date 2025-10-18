// src/lib/auth-cookies.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/** Usar en Route Handlers: setea cookies en la RESPUESTA */
export function withAuthCookies(
  res: NextResponse,
  access: string,
  refresh: string
) {
  res.cookies.set('accessToken', access, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1h
  })
  res.cookies.set('refreshToken', refresh, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14d
  })
  return res
}

/** Usar en Route Handlers: borrar cookies en la RESPUESTA */
export function withClearedAuthCookies(res: NextResponse) {
  res.cookies.delete('accessToken')
  res.cookies.delete('refreshToken')
  return res
}

/** Leer cookies (nota: cookies() ahora es async en Next 15) */
export async function readTokens() {
  const store = await cookies()
  return {
    access: store.get('accessToken')?.value,
    refresh: store.get('refreshToken')?.value,
  }
}

