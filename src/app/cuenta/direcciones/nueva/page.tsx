'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevaDireccion() {
  const router = useRouter()
  const [f, setF] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  })
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({message:'Error'}))
      setErr(j.message || 'Error')
      return
    }
    router.push('/cuenta/direcciones')
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Agregar dirección</h1>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Etiqueta (Casa, Trabajo…)" value={f.label} onChange={e=>setF({...f,label:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Dirección (línea 1) *" value={f.line1} onChange={e=>setF({...f,line1:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Dirección (línea 2)" value={f.line2} onChange={e=>setF({...f,line2:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Ciudad *" value={f.city} onChange={e=>setF({...f,city:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Departamento/Estado" value={f.state} onChange={e=>setF({...f,state:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Código postal" value={f.zip} onChange={e=>setF({...f,zip:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Teléfono" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
        <div className="flex gap-2">
          <button className="rounded bg-black text-white px-4 py-2 text-sm">Guardar</button>
          <button type="button" onClick={()=>history.back()} className="rounded border px-4 py-2 text-sm">Cancelar</button>
        </div>
      </form>
    </main>
  )
}
