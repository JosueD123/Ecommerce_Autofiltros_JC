// src/app/admin/layout.tsx
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic' // evita caché

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const me = await getSessionUser().catch(() => null)

  if (!me || me.role !== 'ADMIN') {
    redirect('/login?next=/admin/productos')
  }

  return <>{children}</>
}






