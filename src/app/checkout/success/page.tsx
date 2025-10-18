// src/app/checkout/success/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

type OrderItem = { id: number; name: string; qty: number; price: number }
type Order = { id: number; total: number; items: OrderItem[] }

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CheckoutSuccessInner />
    </Suspense>
  )
}

function PageFallback() {
  return (
    <main className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-gray-600">Cargando detalle…</p>
    </main>
  )
}

function CheckoutSuccessInner() {
  const qs = useSearchParams()
  const orderId = qs.get('o')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!orderId) { setLoading(false); return }
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          // Normaliza por si viene como string
          setOrder({
            id: Number(data.id),
            total: Number(data.total),
            items: (data.items || []).map((it: any) => ({
              id: Number(it.id),
              name: String(it.name),
              qty: Number(it.qty),
              price: Number(it.price),
            })),
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orderId])

  return (
    <main className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-gray-600 mb-6">
        Gracias por tu compra. Te hemos enviado un correo con la confirmación.
      </p>

      {loading && <p className="text-sm text-gray-500">Cargando detalle…</p>}

      {!loading && !order && (
        <div className="text-sm text-gray-500">
          No se encontró información del pedido.
        </div>
      )}

      {order && (
        <div className="text-left inline-block text-sm border rounded-xl p-4 bg-white/70 shadow-sm mb-6 w-full max-w-lg">
          <p className="font-semibold mb-2">Resumen del pedido #{order.id}</p>
          <ul className="divide-y">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center justify-between py-1">
                <span>{it.name} × {it.qty}</span>
                <span>Q {(it.price * it.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>Q {order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Link
          href="/catalogo"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Volver al catálogo
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}

