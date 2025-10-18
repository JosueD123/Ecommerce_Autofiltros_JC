// src/lib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'app_session'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export type TokenPayload = { id: number; role: 'CUSTOMER' | 'ADMIN' | 'SELLER' }

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as TokenPayload } catch { return null }
}

export async function getSessionUser() {
  // 👈 ahora esperamos cookies()
  const c = (await cookies()).get(COOKIE_NAME)?.value
  if (!c) return null
  const payload = verifyToken(c)
  if (!payload) return null
  const user = await prisma.user.findUnique({ where: { id: payload.id } })
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export async function setSessionCookie(payload: TokenPayload) {
  const store = await cookies() // 👈 esperar cookies()
  store.set({
    name: COOKIE_NAME,
    value: signToken(payload),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
}

export async function clearSessionCookie() {
  const store = await cookies() // 👈 esperar cookies()
  store.set({ name: COOKIE_NAME, value: '', path: '/', maxAge: 0 })
}

