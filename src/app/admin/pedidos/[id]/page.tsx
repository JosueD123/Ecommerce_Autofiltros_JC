import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderStatusSelect from '@/components/OrderStatusSelect'

type P = { id: string }

export default async function PedidoDetalle({
  params,
}: { params: Promise<P> }) {
  const { id } = await params
  const orderId = Number(id)

  const o = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  })

  if (!o) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-600">Pedido no encontrado.</p>
        <Link href="/admin/pedidos" className="underline">← Volver</Link>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido #{o.id}</h1>
        <Link href="/admin/pedidos" className="text-sm underline">← Volver a la lista</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Información</h2>
          <p><span className="text-gray-600">Fecha:</span> {new Date(o.createdAt).toLocaleString()}</p>
          <p><span className="text-gray-600">Email:</span> {o.email}</p>
          <p><span className="text-gray-600">Stripe ID:</span> {o.stripeId || '—'}</p>
          <p className="mt-2">
            <span className="text-gray-600">Estado:</span>{' '}
            <OrderStatusSelect orderId={o.id} value={o.status as any}/>
          </p>
          <p className="mt-2">
            <span className="text-gray-600">Total:</span>{' '}
            {o.currency} {Number(o.total).toFixed(2)}
          </p>
        </section>

        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Items</h2>
          <div className="space-y-2">
            {o.items.map(it => (
              <div key={it.id} className="flex items-center justify-between border-b pb-1">
                <div>
                  <div className="font-medium text-sm">{it.name}</div>
                  <div className="text-xs text-gray-600">
                    Q {Number(it.price).toFixed(2)} × {it.qty}
                  </div>
                </div>
                <div className="text-sm">
                  Q {(Number(it.price) * it.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
