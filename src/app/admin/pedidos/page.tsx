import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '@/components/OrderStatusSelect'

type SP = { q?: string; status?: string; page?: string }

const PAGE_SIZE = 20

export default async function AdminPedidos({
  searchParams,
}: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const q = (sp.q ?? '').trim()
  const status = sp.status ?? ''
  const page = Math.max(1, Number(sp.page ?? '1') || 1)

  const where: any = {}
  if (status && ['PENDING','PAID','CANCELLED'].includes(status)) where.status = status
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { stripeId: { contains: q } },
      { id: Number.isFinite(Number(q)) ? Number(q) : undefined } as any,
    ].filter(Boolean)
  }

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.order.count({ where: Object.keys(where).length ? where : undefined }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const base = new URLSearchParams()
  if (q) base.set('q', q)
  if (status) base.set('status', status)
  const link = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams(base.toString())
    Object.entries(extra).forEach(([k, v]) => {
      if (v === undefined || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    const s = p.toString()
    return `/admin/pedidos${s ? `?${s}` : ''}`
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>

      {/* Filtros */}
      <form className="flex flex-wrap items-center gap-3 mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por email, ID, stripeId"
          className="border rounded px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="border rounded px-2 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button className="rounded bg-black text-white px-3 py-2 text-sm">
          Filtrar
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Items</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2">#{o.id}</td>
                <td className="p-2">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{o.email}</td>
                <td className="p-2">
                  {o.currency} {Number(o.total).toFixed(2)}
                </td>
                <td className="p-2">
                  {/* client select inline */}
                  <OrderStatusSelect orderId={o.id} value={o.status as any} />
                </td>
                <td className="p-2">{o.items.length}</td>
                <td className="p-2">
                  <Link
                    className="text-blue-600 underline"
                    href={`/admin/pedidos/${o.id}`}
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={7}>
                  No hay pedidos con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <a
          className={`px-3 py-1 border rounded ${
            page <= 1 ? 'pointer-events-none opacity-50' : ''
          }`}
          href={page > 1 ? link({ page: page - 1 }) : '#'}
        >
          ← Anterior
        </a>
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <a
          className={`px-3 py-1 border rounded ${
            page >= totalPages ? 'pointer-events-none opacity-50' : ''
          }`}
          href={page < totalPages ? link({ page: page + 1 }) : '#'}
        >
          Siguiente →
        </a>
      </div>
    </main>
  )
}
