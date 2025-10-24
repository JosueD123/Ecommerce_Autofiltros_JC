// src/app/admin/layout.tsx
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic' // evita caché en Vercel

async function getMe() {
  // Leemos cookies de la sesión actual
  const cookieHeader = cookies().toString()

  // Llamamos al endpoint que ya devuelve el user con rol
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  }).catch(() => null)

  if (!res?.ok) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const me = await getMe()
  const isAdmin = !!me?.authenticated && me?.user?.role === 'ADMIN'

  if (!isAdmin) {
    redirect('/login?next=/admin/productos') // redirige si no es admin
  }

  return <>{children}</>
}

