'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckoutSuccess() {
  const qs = useSearchParams()
  const orderId = qs.get('o')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!orderId) return setLoading(false)
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) setOrder(await res.json())
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
        <div className="text-left inline-block text-sm border rounded-xl p-4 bg-white/70 shadow-sm mb-6">
          <p className="font-semibold mb-2">Resumen del pedido</p>
          <ul className="divide-y">
            {order.items.map((it: any) => (
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
