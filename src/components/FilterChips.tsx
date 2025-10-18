'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export default function FilterChips() {
  const qs = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const q   = qs.get('q') || ''
  const marca = qs.get('marca')
  const categoria = qs.get('categoria')

  const chips: { key: string; label: string }[] = []
  if (q) chips.push({ key: 'q', label: `Búsqueda: “${q}”` })
  if (marca) chips.push({ key: 'marca', label: `Marca #${marca}` })
  if (categoria) chips.push({ key: 'categoria', label: `Categoría #${categoria}` })

  function clearKey(k: string) {
    const p = new URLSearchParams(qs.toString())
    p.delete(k)
    p.delete('page') // resetear página al limpiar
    router.replace(`${pathname}${p.toString() ? `?${p.toString()}` : ''}`)
  }

  function clearAll() {
    router.replace(pathname)
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map(ch => (
        <button
          key={ch.key}
          onClick={() => clearKey(ch.key)}
          className="text-sm border rounded-full px-3 py-1 bg-white hover:bg-gray-50"
          title="Quitar filtro"
        >
          {ch.label} <span className="ml-1">×</span>
        </button>
      ))}
      <button onClick={clearAll} className="text-sm underline ml-2">
        Limpiar todo
      </button>
    </div>
  )
}
