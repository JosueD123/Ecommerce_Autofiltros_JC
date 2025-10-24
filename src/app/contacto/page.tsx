'use client'

import { useState } from 'react'

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setOk(null); setErr(null)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.message || 'Error enviando tu mensaje')
      setOk('¡Gracias! Recibimos tu mensaje y te contactaremos pronto.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (e:any) {
      setErr(e.message || 'Error de red')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="rounded-2xl border p-6 bg-[linear-gradient(90deg,#ffe5e5,transparent_50%),radial-gradient(700px_180px_at_-20%_-40%,#ffcdd2,transparent)]">
        <h1 className="text-2xl font-bold text-[#b71c1c]">Contáctanos</h1>
        <p className="text-sm text-gray-700 mt-1">
          ¿Tienes dudas sobre productos, existencias o envíos? Escríbenos y con gusto te ayudamos.
        </p>
      </header>

      <section className="rounded-2xl border p-6 bg-white/90 backdrop-blur">
        <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-2"
            placeholder="Nombre completo *"
            value={form.name}
            onChange={(e)=>setForm({...form, name: e.target.value})}
            required
          />
          <input
            type="email"
            className="border rounded-lg p-2"
            placeholder="Correo electrónico *"
            value={form.email}
            onChange={(e)=>setForm({...form, email: e.target.value})}
            required
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e)=>setForm({...form, phone: e.target.value})}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Asunto"
            value={form.subject}
            onChange={(e)=>setForm({...form, subject: e.target.value})}
          />
          <textarea
            className="border rounded-lg p-2 sm:col-span-2"
            rows={5}
            placeholder="Mensaje *"
            value={form.message}
            onChange={(e)=>setForm({...form, message: e.target.value})}
            required
          />
          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              disabled={busy}
              className="rounded-lg bg-[#b71c1c] text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-40"
            >
              {busy ? 'Enviando…' : 'Enviar mensaje'}
            </button>
            {ok && <span className="text-sm text-emerald-700">{ok}</span>}
            {err && <span className="text-sm text-red-600">{err}</span>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border p-6 text-sm">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="font-semibold">Teléfono</div>
            <a className="underline" href="tel:+50244984479">+502 4498 4479</a>
          </div>
          <div>
            <div className="font-semibold">Email</div>
            <a className="underline" href="mailto:ventas@grupojcautomotriz.com">ventas@grupojcautomotriz.com</a>
          </div>
          <div>
            <div className="font-semibold">Horario</div>
            Lun–Sáb 8:00–18:00
          </div>
        </div>
      </section>
    </main>
  )
}

