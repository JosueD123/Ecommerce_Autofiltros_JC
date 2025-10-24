'use client'
import { useEffect, useState } from 'react'

type Brand = { id:number; name:string }

// util simple para fetch con mensajes útiles
async function jfetch<T>(url:string, init?:RequestInit): Promise<T> {
  const res = await fetch(url, { credentials:'include', cache:'no-store', ...init })
  let json:any = null
  try { json = await res.json() } catch {}
  if (!res.ok || (json && json.ok === false)) {
    throw new Error(json?.message || `HTTP ${res.status}`)
  }
  return (json ?? ({} as T)) as T
}

export default function AdminMarcas() {
  const [list, setList] = useState<Brand[]>([])
  const [name, setName] = useState('')

  // edición inline
  const [editingId, setEditingId] = useState<number|null>(null)
  const [editName, setEditName] = useState('')

  async function load() {
    // GET existente
    const data = await jfetch<Brand[]>('/api/admin/brands')
    setList(data)
  }
  useEffect(()=>{ load().catch(e=>alert(e.message)) },[])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    // POST existente (crear)
    await jfetch('/api/admin/brands', {
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
    // NUEVO: actualizar
    await jfetch('/api/admin/brands/update', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, name: n })
    })
    setEditingId(null)
    await load()
  }

  async function remove(id:number) {
    if (!confirm('¿Eliminar marca?')) return
    // NUEVO: eliminar (protege si hay productos asociados)
    try {
      await jfetch('/api/admin/brands/delete', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id })
      })
      setList(x => x.filter(b => b.id !== id))
    } catch (e:any) {
      alert(e.message || 'No se pudo eliminar')
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin · Marcas</h1>

      <form onSubmit={create} className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Nueva marca"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4">Agregar</button>
      </form>

      <ul className="border rounded divide-y">
        {list.map(b=>(
          <li key={b.id} className="p-2 flex items-center gap-3">
            {editingId === b.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 flex-1"
                  value={editName}
                  onChange={e=>setEditName(e.target.value)}
                />
                <button onClick={()=>save(b.id)} className="text-emerald-700">Guardar</button>
                <button onClick={()=>setEditingId(null)} className="text-gray-600">Cancelar</button>
              </>
            ) : (
              <>
                <span className="flex-1">{b.name}</span>
                <button onClick={()=>{setEditingId(b.id); setEditName(b.name)}} className="text-blue-700">Editar</button>
                <button onClick={()=>remove(b.id)} className="text-rose-700">Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

