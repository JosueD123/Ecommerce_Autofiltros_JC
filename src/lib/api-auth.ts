import { cookies } from 'next/headers'
import { verifyToken, type TokenPayload } from '@/lib/auth'

const COOKIE_NAME = 'app_session'

/** Devuelve el payload si la sesión existe y el rol es ADMIN o SELLER; si no, null */
export async function requireAdmin(): Promise<TokenPayload | null> {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  const payload = raw ? verifyToken(raw) : null
  if (!payload) return null
  if (payload.role !== 'ADMIN' && payload.role !== 'SELLER') return null
  return payload
}
