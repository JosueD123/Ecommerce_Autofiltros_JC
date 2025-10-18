import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MisPedidos() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/pedidos')

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ userId: user.id }, { email: user.email }],
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      {orders.length === 0 ? (
        <div className="rounded-2xl border p-4 text-sm">
          Aún no tienes pedidos. <Link href="/catalogo" className="underline">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">#{o.id}</td>
                  <td className="p-3">{o.createdAt.toLocaleString()}</td>
                  <td className="p-3">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3 text-right">Q {Number(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
