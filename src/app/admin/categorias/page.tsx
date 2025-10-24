'use client'
import { useEffect, useState } from 'react'

type Category = { id:number; name:string; slug:string }

async function jfetch<T>(url:string, init?:RequestInit): Promise<T> {
  const res = await fetch(url, { credentials:'include', cache:'no-store', ...init })
  let json:any = null
  try { json = await res.json() } catch {}
  if (!res.ok || (json && json.ok === false)) {
    throw new Error(json?.message || `HTTP ${res.status}`)
  }
  return (json ?? ({} as T)) as T
}

export default function AdminCategorias() {
  const [list, setList] = useState<Category[]>([])
  const [name, setName] = useState('')

  const [editingId, setEditingId] = useState<number|null>(null)
  const [editName, setEditName] = useState('')

  async function load() {
    // GET existente
    const data = await jfetch<Category[]>('/api/admin/categories')
    setList(data)
  }
  useEffect(()=>{ load().catch(e=>alert(e.message)) },[])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    // POST existente (crear)
    await jfetch('/api/admin/categories', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: name.trim() })
    })
    setName('')
    await load()
  }

  async function save(id:number) {
    const n = editName.trim()
    if (!n) return
    // NUEVO: actualizar (recalcula slug en backend)
    await jfetch('/api/admin/categories/update', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, name: n })
    })
    setEditingId(null)
    await load()
  }

  async function remove(id:number) {
    if (!confirm('¿Eliminar categoría?')) return
    try {
      // NUEVO: eliminar (bloquea si hay productos asociados)
      await jfetch('/api/admin/categories/delete', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id })
      })
      setList(x => x.filter(c => c.id !== id))
    } catch (e:any) {
      alert(e.message || 'No se pudo eliminar')
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin · Categorías</h1>

      <form onSubmit={create} className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Nueva categoría"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4">Agregar</button>
      </form>

      <ul className="border rounded divide-y">
        {list.map(c=>(
          <li key={c.id} className="p-2 flex items-center gap-3">
            {editingId === c.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 flex-1"
                  value={editName}
                  onChange={e=>setEditName(e.target.value)}
                />
                <button onClick={()=>save(c.id)} className="text-emerald-700">Guardar</button>
                <button onClick={()=>setEditingId(null)} className="text-gray-600">Cancelar</button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <span>{c.name}</span>{' '}
                  <span className="text-gray-500 text-xs">({c.slug})</span>
                </div>
                <button onClick={()=>{setEditingId(c.id); setEditName(c.name)}} className="text-blue-700">Editar</button>
                <button onClick={()=>remove(c.id)} className="text-rose-700">Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

