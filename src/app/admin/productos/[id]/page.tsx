'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Img = { url: string; isPrimary?: boolean }
type Prod = {
  id: number
  name: string
  slug: string
  sku: string
  description?: string | null
  price: number
  cost: number
  stock: number
  brandId: number
  categoryId: number
  images?: Img[]
}

export default function EditProducto() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [p, setP] = useState<Prod | null>(null)
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([])
  const [cats, setCats] = useState<{ id: number; name: string }[]>([])

  // Carga producto + listas (brands/cats)
  useEffect(() => {
    (async () => {
      const [resP, resB, resC] = await Promise.all([
        fetch('/api/admin/products', { cache: 'no-store', credentials: 'include' }),
        fetch('/api/admin/brands',   { cache: 'no-store', credentials: 'include' }),
        fetch('/api/admin/categories',{ cache: 'no-store', credentials: 'include' }),
      ])

      const list: Prod[] = await resP.json()
      const found = list.find(x => String(x.id) === String(id)) || null
      setP(found)

      if (resB.ok) setBrands(await resB.json())
      if (resC.ok) setCats(await resC.json())
    })()
  }, [id])

  if (!p) return <main className="p-6">Cargando…</main>
  const prod = p as Prod

  function setField<K extends keyof Prod>(k: K, v: Prod[K]) {
    setP(prev => (prev ? { ...prev, [k]: v } : prev))
  }

  async function save() {
    if (!p) return
    const { createdAt: _c, OrderItem: _oi, ...payload } = p as any
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok) router.push('/admin/productos')
    else alert(j.message || 'Error al guardar')
  }

  async function del() {
    if (!confirm('¿Eliminar producto?')) return
    const res = await fetch(`/api/admin/products/${prod.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok) router.push('/admin/productos')
    else alert(j.message || 'Error al eliminar')
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const fd = new FormData()
    fd.append('file', f)
    const res = await fetch('/api/upload/image', { method: 'POST', body: fd, credentials: 'include' })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) { alert(j.message || 'Error al subir'); return }
    setP(prev => {
      if (!prev) return prev
      const imgs = prev.images ?? []
      return {
        ...prev,
        images: [...imgs, { url: String(j.url), isPrimary: imgs.length === 0 }],
      }
    })
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Editar producto</h1>

      {(['name', 'slug', 'sku', 'description'] as (keyof Prod)[]).map(k => (
        <input
          key={String(k)}
          className="border rounded p-2 w-full"
          placeholder={String(k)}
          value={(prod[k] as any) ?? ''}
          onChange={e => setField(k, e.target.value as any)}
        />
      ))}

      <div className="grid grid-cols-3 gap-3">
        <input
          className="border rounded p-2"
          type="number"
          placeholder="price"
          value={Number(prod.price)}
          onChange={e => setField('price', Number(e.target.value))}
        />
        <input
          className="border rounded p-2"
          type="number"
          placeholder="cost"
          value={Number(prod.cost)}
          onChange={e => setField('cost', Number(e.target.value))}
        />
        <input
          className="border rounded p-2"
          type="number"
          placeholder="stock"
          value={Number(prod.stock)}
          onChange={e => setField('stock', Number(e.target.value))}
        />
      </div>

      {/* ✅ Selects Marca/Categoría */}
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border rounded p-2"
          value={prod.brandId ?? ''}
          onChange={e => setField('brandId', Number(e.target.value))}
        >
          <option value="">— Marca —</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select
          className="border rounded p-2"
          value={prod.categoryId ?? ''}
          onChange={e => setField('categoryId', Number(e.target.value))}
        >
          <option value="">— Categoría —</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Subida de imagen */}
      <div className="border rounded-xl p-3 space-y-2">
        <label className="block text-sm font-medium">Imágenes</label>
        <input type="file" accept="image/*" onChange={onFile} />
        <div className="flex gap-2 flex-wrap">
          {(prod.images ?? []).map((img, idx) => (
            <div key={idx} className="w-24 h-24 border rounded overflow-hidden relative">
              <img src={img.url} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={save} className="px-4 py-2 rounded bg-black text-white">Guardar</button>
        <button onClick={del} className="px-4 py-2 rounded bg-red-600 text-white">Eliminar</button>
      </div>
    </main>
  )
}
