'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { useMemo } from 'react'
import { useToast } from '@/components/Toast'

type Img = { url: string }
type Props = {
  id: number
  name: string
  slug: string
  price: number
  images?: Img[]
  stock?: number
  createdAt?: string // ISO string (opcional)
}

export default function ProductCard({
  id, name, slug, price, images = [], stock, createdAt
}: Props) {
  const { add } = useCart()
  const { show } = useToast()

  const img = images[0]?.url
  const isOut = typeof stock === 'number' && stock <= 0
  const isNew = useMemo(() => {
    if (!createdAt) return false
    const d = new Date(createdAt)
    const days = (Date.now() - d.getTime()) / 86400000
    return days <= 45
  }, [createdAt])

  function addOne() {
    add({ id, name, price, qty: 1, slug, img })
    show({
      title: 'Producto agregado',
      desc: name,
      actionLabel: 'Ver carrito',
      onAction: () => (window.location.href = '/carrito'),
    })
  }

  return (
    <article
      className="group rounded-2xl border bg-white/90 backdrop-blur overflow-hidden transition
                 hover:shadow-lg hover:-translate-y-[1px] hover:border-gray-300"
    >
      {/* Imagen */}
      <Link href={`/producto/${slug}`} className="block relative">
        <div className="aspect-square bg-gray-50 flex items-center justify-center">
          {img ? (
            <img
              src={img}
              alt={name}
              className="object-contain w-full h-full transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="text-xs text-gray-400">Sin imagen</span>
          )}
        </div>

        {/* Badges */}
        {(isNew || isOut) && (
          <div className="absolute left-2 top-2 flex gap-2">
            {isNew && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px]">
                Nuevo
              </span>
            )}
            {isOut && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px]">
                Sin stock
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-3">
        <Link href={`/producto/${slug}`} className="line-clamp-2 font-medium leading-snug">
          {name}
        </Link>

        {/* Precio en “pill” */}
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 font-semibold ring-1 ring-emerald-100">
            Q {price.toFixed(2)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={addOne}
            disabled={isOut}
            className={`w-full rounded-lg px-3 py-2 text-sm text-white transition ${
              isOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:opacity-90'
            }`}
          >
            Agregar al carrito
          </button>
          <Link
            href={`/producto/${slug}`}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Ver
          </Link>
        </div>
      </div>
    </article>
  )
}



