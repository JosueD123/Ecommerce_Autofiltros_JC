'use client'

import { useCart } from '@/store/cart'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/Toast'

export default function CartDrawer() {
  const { items, remove, clear, inc, dec, setQty } = useCart()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [open, setOpen] = useState(false)
  const { show } = useToast()

  // No mostrar carrito en secciones de Admin
  if (isAdmin) return null

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  )

  // Bloquear scroll del documento y cerrar con ESC
  useEffect(() => {
    const root = document.documentElement
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)

    if (open) {
      root.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    return () => {
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* Botón del carrito en el header */}
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        🛒 Carrito
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[11px] px-1.5 rounded-full">
            {items.length}
          </span>
        )}
      </button>

      {/* Overlay (siempre montado para animación; sin eventos cuando está cerrado) */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer fijo: no ensancha la página y no “se queda” al hacer scroll horizontal */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 h-dvh w-full sm:w-[420px] bg-white text-gray-900
          flex flex-col shadow-2xl ring-1 ring-black/5 border-l
          transition-transform duration-300 will-change-transform
          ${open ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
      >
        <header className="h-14 px-5 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold">Carrito de compras</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-black"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        {/* Lista con scroll vertical interno */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-700">
              Tu carrito está vacío.{' '}
              <Link href="/catalogo" onClick={() => setOpen(false)} className="underline">
                Ver catálogo
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((i) => (
                <li key={i.id} className="py-4">
                  <div className="grid grid-cols-[80px,1fr,auto] items-center gap-3">
                    <div className="w-20 h-20 rounded-xl border bg-white overflow-hidden flex items-center justify-center">
                      {i.img ? (
                        <img src={i.img} alt={i.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-xs text-gray-400">Sin imagen</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-5 line-clamp-2">{i.name}</div>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <button
                          onClick={() => dec(i.id)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                          aria-label="Disminuir"
                        >
                          –
                        </button>
                        <input
                          value={i.qty}
                          onChange={(e) => {
                            const q = Number(e.target.value)
                            if (Number.isFinite(q) && q >= 0) setQty(i.id, q)
                          }}
                          inputMode="numeric"
                          className="w-12 h-8 border rounded-full text-center text-sm"
                          aria-label="Cantidad"
                        />
                        <button
                          onClick={() => inc(i.id)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">Q {i.price.toFixed(2)} c/u</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        Q {(i.price * i.qty).toFixed(2)}
                      </div>
                      <button
                        onClick={() => {
                          remove(i.id)
                          show({ title: 'Quitado del carrito', desc: i.name })
                        }}
                        className="mt-2 text-xs text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer fijo */}
        <footer className="border-t p-5 bg-white">
          <div className="flex items-center justify-between text-base font-semibold mb-3">
            <span>Total</span>
            <span>Q {subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full py-3 font-semibold bg-black text-white hover:opacity-90 transition"
          >
            Proceder al pago
          </Link>
          <button
            onClick={() => {
              clear()
              show({ title: 'Carrito vacío' })
            }}
            className="mt-3 w-full rounded-full py-3 border hover:bg-gray-50"
          >
            Vaciar carrito
          </button>
        </footer>
      </aside>
    </>
  )
}



