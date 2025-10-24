// ✅ src/lib/auth.ts — versión adaptada para evitar el loop y compatibilidad total
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'app_session'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export type TokenPayload = {
  id: number
  role: 'CUSTOMER' | 'ADMIN' | 'SELLER'
}

/**
 * =========================
 *  JWT Helpers
 * =========================
 */
export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

/**
 * =========================
 *  Sesión: obtener usuario actual
 * =========================
 */
export async function getSessionUser() {
  // ✅ usar await cookies() (Next 15+)
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return null

  const payload = verifyToken(raw)
  if (!payload) return null

  // Buscar usuario real
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) return null
  return user
}

/**
 * =========================
 *  Guardar cookie de sesión
 * =========================
 */
export async function setSessionCookie(payload: TokenPayload) {
  const store = await cookies()
  const token = signToken(payload)

  // ⚙️ Asegura compatibilidad en local y producción
  const isProd = process.env.NODE_ENV === 'production'

  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',      // evita perder cookie al redirigir
    secure: isProd,       // ✅ en localhost = false, en Vercel = true
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
}

/**
 * =========================
 *  Limpiar cookie (logout)
 * =========================
 */
export async function clearSessionCookie() {
  const store = await cookies()
  store.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  })
}


