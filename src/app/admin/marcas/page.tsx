'use client'
import { useEffect, useState } from 'react'

export default function AdminMarcas() {
  const [list, setList] = useState<{id:number; name:string}[]>([])
  const [name, setName] = useState('')

  async function load() {
    const res = await fetch('/api/admin/brands', { credentials:'include', cache:'no-store' })
    if (res.ok) setList(await res.json())
  }
  useEffect(()=>{ load() },[])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const res = await fetch('/api/admin/brands', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({ name })
    })
    if (res.ok) { setName(''); load() }
    else alert('No se pudo crear')
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin · Marcas</h1>
      <form onSubmit={create} className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Nueva marca" value={name} onChange={e=>setName(e.target.value)} />
        <button className="rounded bg-black text-white px-4">Agregar</button>
      </form>
      <ul className="border rounded divide-y">
        {list.map(b=>(
          <li key={b.id} className="p-2">{b.name}</li>
        ))}
      </ul>
    </main>
  )
}
