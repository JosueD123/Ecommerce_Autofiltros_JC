'use client'

import { useEffect, useState } from 'react'

type FitItem = {
  make: string
  model: string
  year: number
  engine: string | null
  body: string | null
  notes: string | null
}

export default function Compatibilidad({ productId }: { productId: number }) {
  const [items, setItems] = useState<FitItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/fitments/by-product?pid=${productId}`, { cache: 'no-store' })
        const j = await res.json()
        if (res.ok && j?.ok) setItems(j.items as FitItem[])
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  if (loading) return <p className="text-sm text-gray-500">Cargando compatibilidades…</p>
  if (!items.length)
    return <p className="text-sm text-gray-500">Aún no se registraron compatibilidades para este producto.</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg">
        <thead className="text-left border-b bg-gray-50">
          <tr>
            <th className="py-2 px-3">Marca</th>
            <th className="py-2 px-3">Modelo</th>
            <th className="py-2 px-3">Año</th>
            <th className="py-2 px-3">Motor</th>
            <th className="py-2 px-3">Carrocería</th>
            <th className="py-2 px-3">Notas</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 px-3">{it.make}</td>
              <td className="py-2 px-3">{it.model}</td>
              <td className="py-2 px-3">{it.year}</td>
              <td className="py-2 px-3">{it.engine ?? '—'}</td>
              <td className="py-2 px-3">{it.body ?? '—'}</td>
              <td className="py-2 px-3">{it.notes ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

