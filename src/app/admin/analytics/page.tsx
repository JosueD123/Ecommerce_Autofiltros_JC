// src/app/admin/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar
} from 'recharts'

type Monthly = { month: string; total: number }
type TopProd = { productId: number; name: string; qty: number }
type LastOrder = { id: number; email: string; total: number; status: string; createdAt: string; userName: string | null }

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [monthly, setMonthly] = useState<Monthly[]>([])
  const [topProducts, setTopProducts] = useState<TopProd[]>([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [lastOrders, setLastOrders] = useState<LastOrder[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' })
        const j = await res.json()
        if (j?.ok) {
          setMonthly(j.monthly)
          setTopProducts(j.topProducts)
          setTotalCustomers(j.totalCustomers)
          setLastOrders(j.lastOrders)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <main className="max-w-6xl mx-auto p-6">Cargando…</main>
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Panel de estadísticas</h1>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 bg-white/80">
          <div className="text-sm text-gray-500">Clientes</div>
          <div className="text-2xl font-semibold">{totalCustomers}</div>
        </div>
        <div className="rounded-xl border p-4 bg-white/80">
          <div className="text-sm text-gray-500">Mes actual</div>
          <div className="text-2xl font-semibold">
            Q {Number(monthly.find(m => m.month === currentYYYYMM())?.total ?? 0).toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white/80">
          <div className="text-sm text-gray-500">Últimos 6 meses</div>
          <div className="text-2xl font-semibold">
            Q {monthly.reduce((s, m) => s + (m.total || 0), 0).toFixed(2)}
          </div>
        </div>
      </section>

      {/* Ventas mensuales */}
      <section className="rounded-xl border p-4 bg-white/80">
        <h2 className="font-semibold mb-3">Ventas por mes (GTQ)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#000" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top productos */}
      <section className="rounded-xl border p-4 bg-white/80">
        <h2 className="font-semibold mb-3">Top productos (por unidades)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={(v) => (String(v).length > 10 ? String(v).slice(0, 10) + '…' : v)} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Últimos pedidos */}
      <section className="rounded-xl border p-4 bg-white/80">
        <h2 className="font-semibold mb-3">Últimos pedidos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Cliente</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {lastOrders.map(o => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{o.id}</td>
                  <td className="py-2 pr-4">{o.userName ?? '-'}</td>
                  <td className="py-2 pr-4">{o.email}</td>
                  <td className="py-2 pr-4">Q {o.total.toFixed(2)}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      o.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : o.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    {new Date(o.createdAt).toLocaleString('es-GT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function currentYYYYMM() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
