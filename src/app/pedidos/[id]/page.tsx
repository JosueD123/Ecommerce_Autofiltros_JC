// src/app/pedidos/[id]/page.tsx
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

function formatQ(n: number) {
  return `Q ${n.toFixed(2)}`
}

function StatusPill({ s }: { s: 'PENDING' | 'PAID' | 'CANCELLED' }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${map[s]}`}>
      {s === 'PENDING' ? 'Pendiente' : s === 'PAID' ? 'Pagado' : 'Cancelado'}
    </span>
  )
}

// 👇 En Next 15, params es Promise
export default async function PedidoDetalle({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const user = await getSessionUser()
  if (!user) redirect(`/login?next=/pedidos/${idStr}`)

  const id = Number(idStr)
  if (!Number.isFinite(id)) notFound()

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id }, // solo sus pedidos
    include: { items: true, user: true },
  })
  if (!order) notFound()

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedido #{order.id}</h1>
          <div className="text-sm text-gray-600">
            {order.createdAt.toLocaleDateString('es-GT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <StatusPill s={order.status} />
      </header>

      <section className="rounded-2xl border bg-white/90 divide-y">
        {order.items.map((it) => (
          <div key={it.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm line-clamp-1">{it.name}</div>
              <div className="text-xs text-gray-600">
                {formatQ(Number(it.price))} × {it.qty}
              </div>
            </div>
            <div className="font-medium">{formatQ(Number(it.price) * it.qty)}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border bg-white/90 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-lg font-semibold">{formatQ(Number(order.total))}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Moneda: {order.currency} • Estado: {order.status}
        </div>
      </section>
    </main>
  )
}

