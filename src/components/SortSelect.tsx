'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function SortSelect({ initial = 'new' }: { initial?: string }) {
  const router = useRouter()
  const qs = useSearchParams()
  const pathname = usePathname()

  // sort actual (qs) con fallback a prop initial
  const sort = qs.get('sort') ?? initial

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const p = new URLSearchParams(qs.toString())
    const v = e.target.value
    if (v === 'new') p.delete('sort')
    else p.set('sort', v)
    p.set('page', '1') // resetear paginación al cambiar orden
    router.replace(`${pathname}${p.toString() ? `?${p.toString()}` : ''}`)
  }

  return (
    <select className="border rounded px-2 py-1" value={sort} onChange={onChange}>
      <option value="new">Más nuevos</option>
      <option value="price_asc">Precio: menor a mayor</option>
      <option value="price_desc">Precio: mayor a menor</option>
    </select>
  )
}

