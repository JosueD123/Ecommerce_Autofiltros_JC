// src/app/admin/layout.tsx
import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getSessionUser().catch(() => null)
  if (!me || me.role !== 'ADMIN') {
    redirect('/login?next=/admin') // solo admins
  }
  return <>{children}</>
}
