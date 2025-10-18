'use client'
import { useEffect, useState } from 'react'

type ProdForm = {
  name: string
  slug: string
  sku: string
  price: number
  cost: number
  stock: number
  brandId: number | ''
  categoryId: number | ''
  description: string
}

export default function AdminProductos() {
  const [items, setItems] = useState<any[]>([])
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([])
  const [cats, setCats] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState<ProdForm>({
    name: '',
    slug: '',
    sku: '',
    price: 0,
    cost: 0,
    stock: 0,
    brandId: '',
    categoryId: '',
    description: '',
  })

  async function load() {
    const [resP, resB, resC] = await Promise.all([
      fetch('/api/admin/products', { cache: 'no-store', credentials: 'include' }),
      fetch('/api/admin/brands', { cache: 'no-store', credentials: 'include' }),
      fetch('/api/admin/categories', { cache: 'no-store', credentials: 'include' }),
    ])
    if (resP.ok) setItems(await resP.json())
    if (resB.ok) setBrands(await resB.json())
    if (resC.ok) setCats(await resC.json())
  }
  useEffect(() => {
    load()
  }, [])

  function toSlug(s: string) {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!form.name.trim()) return setErr('Nombre requerido')
    if (!form.sku.trim()) return setErr('SKU requerido')
    if (!form.brandId || !form.categoryId) return setErr('Selecciona marca y categoría')

    const body = {
      ...form,
      slug: form.slug.trim() || toSlug(form.name),
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
    }

    setLoading(true)
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const j = await res.json().catch(() => ({}))
    setLoading(false)

    if (res.ok) {
      setForm({
        name: '',
        slug: '',
        sku: '',
        price: 0,
        cost: 0,
        stock: 0,
        brandId: '',
        categoryId: '',
        description: '',
      })
      load()
    } else {
      setErr(j.message || 'Error al crear')
      console.error('CREATE ERROR:', j)
    }
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin · Productos</h1>

      <form onSubmit={create} className="grid md:grid-cols-3 gap-3 border p-4 rounded-xl mb-6">
        {/* Básicos */}
        <input
          className="border rounded p-2"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Slug (opcional)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />

        {/* Números */}
<div className="md:col-span-3 grid md:grid-cols-3 gap-3">
  <label className="text-sm font-medium">
    Precio
    <input
      className="border rounded p-2 w-full mt-1"
      placeholder="Precio"
      type="number"
      min={0}
      step="0.01"
      value={form.price}
      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
    />
  </label>

  <label className="text-sm font-medium">
    Costo
    <input
      className="border rounded p-2 w-full mt-1"
      placeholder="Costo"
      type="number"
      min={0}
      step="0.01"
      value={form.cost}
      onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
    />
  </label>

  <label className="text-sm font-medium">
    Stock
    <input
      className="border rounded p-2 w-full mt-1"
      placeholder="Stock"
      type="number"
      min={0}
      step="1"
      value={form.stock}
      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
    />
  </label>
</div>

        {/* Selects Marca/Categoría */}
        <select
          className="border rounded p-2"
          value={form.brandId}
          onChange={(e) => setForm({ ...form, brandId: e.target.value ? Number(e.target.value) : '' })}
        >
          <option value="">— Marca —</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : '' })}
        >
          <option value="">— Categoría —</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="md:col-span-3">
          <textarea
            className="border rounded p-2 w-full"
            rows={3}
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-3">
          <button disabled={loading} className="rounded bg-black text-white py-2 px-4">
            {loading ? 'Creando…' : 'Crear'}
          </button>
          {err && <span className="text-sm text-red-600">{err}</span>}

          <span className="flex-1" />
          {/* Accesos rápidos a creación de catálogos */}
          <a href="/admin/marcas" className="text-sm underline">
            + Nueva marca
          </a>
          <a href="/admin/categorias" className="text-sm underline">
            + Nueva categoría
          </a>
        </div>
      </form>

      {/* Lista simple de productos creados */}
      <div className="grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="border rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">
                SKU {p.sku} · Q {Number(p.price).toFixed(2)}
              </div>
            </div>
            <a className="text-blue-600" href={`/admin/productos/${p.id}`}>
              Editar
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}


