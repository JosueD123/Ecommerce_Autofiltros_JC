import jwt from 'jsonwebtoken'

// Usaremos 'id' en todo lado (y aceptamos 'uid' por compatibilidad)
export type JWTPayload = { id: number; role: 'ADMIN'|'SELLER'|'CUSTOMER' }

const ACCESS_MIN   = Number(process.env.ACCESS_TOKEN_MINUTES || 15)
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7)

export function signAccessToken(payload: JWTPayload){
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: `${ACCESS_MIN}m` })
}
export function signRefreshToken(payload: Pick<JWTPayload,'id'>){
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: `${REFRESH_DAYS}d` })
}
export function verifyAccessToken(token: string): JWTPayload{
  const p = jwt.verify(token, process.env.JWT_SECRET!) as any
  return { id: Number(p.id ?? p.uid), role: p.role } // 👈 acepta id o uid
}
export function verifyRefreshToken(token: string): Pick<JWTPayload,'id'>{
  const p = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any
  return { id: Number(p.id ?? p.uid) }
}

