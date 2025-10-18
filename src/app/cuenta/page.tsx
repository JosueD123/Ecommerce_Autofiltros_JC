import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Cuenta() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/cuenta')

  // Órdenes del usuario (por userId o por email para órdenes antiguas)
  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    select: { total: true, status: true },
    orderBy: { createdAt: 'desc' },
  })

  const count = orders.length
  const totalPaid = orders
    .filter((o) => o.status === 'PAID')
    .reduce((s, o) => s + Number(o.total), 0)

  // ⬇️ Dirección principal del usuario (última agregada)
  const primary = await prisma.address.findFirst({
    where: { userId: user.id },
    orderBy: { id: 'desc' },
  })

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mi cuenta</h1>

      {/* Resumen del usuario */}
      <section className="rounded-2xl border p-4 bg-white/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-semibold">
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-500">Pedidos</div>
            <div className="text-lg font-semibold">{count}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-500">Total pagado</div>
            <div className="text-lg font-semibold">Q {totalPaid.toFixed(2)}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-500">Rol</div>
            <div className="text-lg font-semibold">{user.role}</div>
          </div>
        </div>
      </section>

      {/* Dirección principal + enlaces para gestionar */}
      <section className="rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Dirección principal</div>
          <Link href="/cuenta/direcciones" className="text-sm underline">
            Gestionar
          </Link>
        </div>

        {primary ? (
          <div className="mt-2 text-sm text-gray-700">
            {primary.label ? `${primary.label} · ` : ''}
            {primary.line1}
            {primary.line2 ? `, ${primary.line2}` : ''}
            <br />
            {primary.city}
            {primary.state ? `, ${primary.state}` : ''} {primary.zip || ''}
            {primary.phone ? ` · Tel: ${primary.phone}` : ''}
          </div>
        ) : (
          <div className="text-sm text-gray-600 mt-1">
            Aún no has agregado una dirección.{' '}
            <Link href="/cuenta/direcciones/nueva" className="underline">
              Agregar ahora
            </Link>
          </div>
        )}
      </section>

      {/* Acciones */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/pedidos" className="rounded-2xl border p-4 hover:bg-gray-50">
          🧾 Historial de pedidos
        </Link>

        <form action="/api/auth/logout" method="post" className="rounded-2xl border p-4">
          <button className="w-full hover:bg-gray-50 text-left">↩ Salir</button>
        </form>
      </div>
    </main>
  )
}

