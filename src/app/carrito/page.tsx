'use client'

import { useCart } from '@/store/cart'
import Link from 'next/link'
import { useMemo } from 'react'

function money(n: number) {
  return `Q ${n.toFixed(2)}`
}

export default function Carrito() {
  const { items, remove, clear, inc, dec, setQty } = useCart()

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  )

  if (items.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold">Carrito</h1>
        <div className="mt-6 rounded-2xl border bg-white/80 p-8 text-center">
          <div className="text-4xl mb-2">🧺</div>
          <div className="font-medium">Tu carrito está vacío</div>
          <p className="text-sm text-gray-600 mt-1">
            Agrega productos desde el catálogo para verlos aquí.
          </p>
          <Link
            href="/catalogo"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90"
          >
            Ver catálogo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold">Carrito</h1>

      {/* Contenido: lista + resumen */}
      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* LISTA DE PRODUCTOS */}
        <section className="space-y-4">
          {items.map((i) => {
            const lineTotal = i.price * i.qty
            return (
              <article
                key={i.id}
                className="rounded-2xl border bg-white/90 p-4 md:p-5 flex gap-4 md:gap-5 items-center"
              >
                {/* Imagen */}
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl bg-gray-50 border overflow-hidden">
                  {i.img ? (
                    <img
                      src={i.img}
                      alt={i.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/producto/${i.slug}`}
                    className="font-medium leading-snug hover:underline line-clamp-2"
                  >
                    {i.name}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border">
                      Precio: {money(i.price)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Línea: {money(lineTotal)}
                    </span>
                  </div>

                  {/* Cantidad */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-lg border bg-white">
                      <button
                        aria-label="Disminuir"
                        onClick={() => dec(i.id)}
                        className="px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        −
                      </button>
                      <input
                        value={i.qty}
                        inputMode="numeric"
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          if (Number.isFinite(v)) setQty(i.id, v)
                        }}
                        className="w-12 px-2 py-1.5 text-center text-sm border-x bg-gray-50"
                      />
                      <button
                        aria-label="Aumentar"
                        onClick={() => inc(i.id)}
                        className="px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => remove(i.id)}
                      className="text-xs text-red-600 hover:underline ml-2"
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                {/* Total de línea (desktop) */}
                <div className="hidden md:flex flex-col items-end gap-2">
                  <div className="text-sm font-semibold">{money(lineTotal)}</div>
                </div>
              </article>
            )
          })}

          {/* Acciones en móviles */}
          <div className="md:hidden flex items-center justify-between gap-3 pt-2">
            <button
              onClick={clear}
              className="text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
            >
              Vaciar carrito
            </button>
            <Link
              href="/checkout"
              className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90"
            >
              Ir a pagar
            </Link>
          </div>
        </section>

        {/* RESUMEN (sticky en desktop) */}
        <aside className="lg:sticky lg:top-20 h-max">
          <div className="rounded-2xl border bg-white/90 p-5">
            <h2 className="font-semibold">Resumen</h2>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{money(subtotal)}</span>
              </div>

              {/* Si más adelante agregas envío/impuestos, colócalos aquí */}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />

              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block text-center rounded-lg bg-black text-white py-2.5 text-sm hover:opacity-90"
            >
              Ir a pagar
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/catalogo"
                className="text-center rounded-lg border py-2 text-sm hover:bg-gray-50"
              >
                Seguir comprando
              </Link>
              <button
                onClick={clear}
                className="rounded-lg border py-2 text-sm hover:bg-gray-50"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Confianza */}
            <div className="mt-5 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                💳 <span>Pago seguro (Stripe modo test)</span>
              </div>
              <div className="flex items-center gap-2">
                🚚 <span>Envíos a todo el país</span>
              </div>
              <div className="flex items-center gap-2">
                🔄 <span>Devoluciones fáciles</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

