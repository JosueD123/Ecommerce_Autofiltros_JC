'use client'

import { useEffect, useMemo, useState } from 'react'

type Product = { id:number; sku:string; name:string }
type Make = { id:number; name:string }
type Model = { id:number; name:string; makeId:number }
type Variant = { id:number; year:number; engine:string|null; body:string|null }
type Row = {
  id:number
  variant:{
    id:number
    year:number
    engine:string|null
    body:string|null
    model:{ name:string; make:{ name:string } }
  }
  notes:string|null
}

// jfetch robusto: no intenta res.json() si no hay JSON y eleva un Error con mensaje útil
async function jfetch<T>(url:string, init?:RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: 'no-store' })

  // intenta parsear json si viene, pero no lo exigimos
  let json: any = null
  try { json = await res.json() } catch (_) { /* puede venir vacío en errores viejos */ }

  if (!res.ok || (json && json.ok === false)) {
    const msg = json?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return (json ?? ({} as T)) as T
}

export default function AdminCompatibilidad() {
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState<number | ''>('')

  const [makes, setMakes] = useState<Make[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [variants, setVariants] = useState<Variant[]>([])

  const [makeName, setMakeName] = useState('')
  const [modelName, setModelName] = useState('')
  const [year, setYear] = useState<number | ''>('')
  const [engine, setEngine] = useState('')
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState('')

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  // cargar catálogos base
  useEffect(() => {
    (async () => {
      const p = await jfetch<{ ok:true; products:Product[] }>('/api/admin/fitments/options?scope=products')
      const m = await jfetch<{ ok:true; makes:Make[] }>('/api/admin/fitments/options?scope=makes')
      setProducts(p.products)
      setMakes(m.makes)
    })().catch(err => alert(err.message))
  }, [])

  // helper para recargar la tabla del producto actual
  async function reloadCurrent() {
    if (!productId) { setRows([]); return }
    const list = await jfetch<{ ok:true; rows:Row[] }>(`/api/admin/fitments/list?productId=${productId}`)
    setRows(list.rows)
  }

  useEffect(() => {
    if (!productId) { setRows([]); return }
    setLoading(true)
    reloadCurrent()
      .catch(err => alert(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  // Cuando el admin selecciona una marca existente, precarga modelos
  async function loadModels(makeId:number) {
    const res = await jfetch<{ ok:true; models:Model[] }>(
      '/api/admin/fitments/options?scope=models&makeId=' + makeId
    )
    setModels(res.models)
  }
  async function loadVariants(modelId:number) {
    const res = await jfetch<{ ok:true; variants:Variant[] }>(
      '/api/admin/fitments/options?scope=variants&modelId=' + modelId
    )
    setVariants(res.variants)
  }

  // Reemplaza COMPLETO tu addFitment por este
async function addFitment(e: React.FormEvent) {
  e.preventDefault();

  // Normaliza todos los campos desde tu estado actual
  const pid = Number(productId);
  const mk  = (makeName ?? '').trim();
  const md  = (modelName ?? '').trim();
  const yr  = Number(year);
  const eng = (engine ?? '').trim();
  const bod = (body ?? '').trim();
  const nts = (notes ?? '').trim();

  // Validación en cliente
  if (!Number.isFinite(pid) || !pid || !mk || !md || !Number.isFinite(yr)) {
    alert('Faltan campos requeridos');
    return;
  }

  // Arma payload: solo manda opcionales si traen texto
  const payload: any = { productId: pid, makeName: mk, modelName: md, year: yr };
  if (eng) payload.engine = eng;
  if (bod) payload.body   = bod;
  if (nts) payload.notes  = nts;

  try {
    const res = await fetch('/api/admin/fitments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = 'Error';
      try {
        const j = await res.json();
        msg = j?.message || msg;
      } catch {
        msg = `${msg} (HTTP ${res.status})`;
      }
      alert(msg);
      return;
    }

    // Refresca tabla y limpia notas
    const list = await jfetch<{ ok: true; rows: Row[] }>(
      `/api/admin/fitments/list?productId=${pid}`
    );
    setRows(list.rows);
    setNotes('');
  } catch (err: any) {
    alert(err?.message || 'Error al agregar compatibilidad');
  }
}

  async function removeFitment(id:number) {
    try {
      await jfetch('/api/admin/fitments/remove', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ fitmentId: id }),
      })
      setRows(rows => rows.filter(r => r.id !== id))
    } catch (err:any) {
      alert(err?.message || 'Error al eliminar compatibilidad')
    }
  }

  const selectedProduct = useMemo(
    () => products.find(p => p.id === productId),
    [products, productId]
  )

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Compatibilidades por producto</h1>

      {/* Selección de producto */}
      <section className="rounded-xl border p-4 bg-white/80">
        <label className="block text-sm font-medium mb-2">Producto</label>
        <select
          className="border rounded-lg px-3 py-2 w-full md:w-1/2"
          value={productId}
          onChange={e => setProductId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">— Selecciona un producto —</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.sku} — {p.name}
            </option>
          ))}
        </select>
        {selectedProduct && (
          <p className="mt-2 text-sm text-gray-600">
            <strong>Seleccionado:</strong> {selectedProduct.sku} — {selectedProduct.name}
          </p>
        )}
      </section>

      {/* Formulario agregar */}
      <section className="rounded-xl border p-4 bg-white/80">
        <h2 className="font-semibold mb-3">Agregar compatibilidad</h2>

        <form onSubmit={addFitment} className="grid md:grid-cols-2 gap-4">
          {/* Marca */}
          <div>
            <label className="block text-sm font-medium">Marca</label>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              list="dlist-makes"
              value={makeName}
              onChange={e => {
                setMakeName(e.target.value)
                const found = makes.find(m => m.name.toLowerCase() === e.target.value.toLowerCase())
                if (found) loadModels(found.id).catch(err => alert(err.message))
              }}
              placeholder="Ej: Toyota"
            />
            <datalist id="dlist-makes">
              {makes.map(m => <option key={m.id} value={m.name} />)}
            </datalist>
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-sm font-medium">Modelo</label>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              list="dlist-models"
              value={modelName}
              onChange={async e => {
                setModelName(e.target.value)
                const mk = makes.find(m => m.name.toLowerCase() === makeName.toLowerCase())
                if (mk) {
                  try {
                    const res = await jfetch<{ ok:true; models:Model[] }>(
                      '/api/admin/fitments/options?scope=models&makeId=' + mk.id
                    )
                    setModels(res.models)
                  } catch (err:any) {
                    alert(err.message)
                  }
                }
              }}
              placeholder="Ej: RAV 4"
            />
            <datalist id="dlist-models">
              {models.map(m => <option key={m.id} value={m.name} />)}
            </datalist>
          </div>

          {/* Año */}
          <div>
            <label className="block text-sm font-medium">Año</label>
            <input
              type="number"
              min={1980}
              max={2100}
              className="border rounded-lg px-3 py-2 w-full"
              value={year}
              onChange={e => setYear(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ej: 2016"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Motor (opcional)</label>
              <input
                className="border rounded-lg px-3 py-2 w-full"
                value={engine}
                onChange={e => setEngine(e.target.value)}
                placeholder="1.6L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Carrocería (opcional)</label>
              <input
                className="border rounded-lg px-3 py-2 w-full"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Sedan / SUV"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Notas (opcional)</label>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="OEM 16546-ED500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              disabled={!productId || !makeName || !modelName || !year}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </form>
      </section>

      {/* Tabla de fitments */}
      <section className="rounded-xl border p-4 bg-white/80">
        <h2 className="font-semibold mb-3">Compatibilidades del producto</h2>
        {loading ? (
          <div>Cargando…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-gray-600">Sin registros.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-4">Marca</th>
                  <th className="py-2 pr-4">Modelo</th>
                  <th className="py-2 pr-4">Año</th>
                  <th className="py-2 pr-4">Motor</th>
                  <th className="py-2 pr-4">Carrocería</th>
                  <th className="py-2 pr-4">Notas</th>
                  <th className="py-2 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{r.variant.model.make.name}</td>
                    <td className="py-2 pr-4">{r.variant.model.name}</td>
                    <td className="py-2 pr-4">{r.variant.year}</td>
                    <td className="py-2 pr-4">{r.variant.engine ?? '—'}</td>
                    <td className="py-2 pr-4">{r.variant.body ?? '—'}</td>
                    <td className="py-2 pr-4">{r.notes ?? '—'}</td>
                    <td className="py-2 pr-4">
                      <button
                        onClick={() => removeFitment(r.id)}
                        className="text-rose-700 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

