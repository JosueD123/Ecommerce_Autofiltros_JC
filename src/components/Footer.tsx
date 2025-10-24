'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string>('')
  const [busy, setBusy] = useState(false)

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    if (!email) return

    setBusy(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const j = await res.json().catch(() => ({}))

      if (res.ok) {
        setEmail('')
        setMsg(j?.message || '¡Gracias por suscribirte!')
      } else {
        setMsg(j?.message || 'No se pudo suscribir. Intenta de nuevo.')
      }
    } catch {
      setMsg('Error de red. Intenta nuevamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <footer className="bg-gradient-to-b from-[#fafafa] via-[#f5f5f5] to-[#ef9a9a]/20 border-t-2 border-[#d32f2f] text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#d32f2f] text-white font-bold">AF</span>
            <span className="font-semibold text-[#b71c1c] text-lg">Autofiltros JC</span>
          </div>
          <p className="mt-3 text-sm">
            Filtros y accesorios automotrices en Guatemala. Comprometidos con calidad, rapidez y confianza.
          </p>

          <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c62828]/50"
              disabled={busy}
            />
            <button
              disabled={busy}
              className="px-4 py-2 rounded-md bg-[#c62828] text-white hover:bg-[#b71c1c] transition disabled:opacity-50"
            >
              {busy ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>

          {msg && (
            <p className="mt-2 text-xs text-gray-700">{msg}</p>
          )}
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-2 text-[#b71c1c]">Contacto</h4>
          <ul className="space-y-1 text-sm">
            <li>
              Tel:{' '}
              <a href="tel:+50244984479" className="underline hover:text-[#b71c1c]">
                +502 4498 4479
              </a>
            </li>
            <li>
              Email:{' '}
              <a href="mailto:ventas@autofiltrosjc.com" className="underline hover:text-[#b71c1c]">
                ventas@grupojcautomotriz.com
              </a>
            </li>
            <li>Horario: Lun–Sáb 8:00–18:00</li>
          </ul>
        </div>

        {/* Enlaces */}
        <div>
          <h4 className="font-semibold mb-2 text-[#b71c1c]">Enlaces</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/catalogo" className="hover:text-[#c62828]">Catálogo</Link></li>
            <li><Link href="/carrito" className="hover:text-[#c62828]">Carrito</Link></li>
            <li><Link href="/cuenta" className="hover:text-[#c62828]">Mi cuenta</Link></li>
            <li><Link href="/contacto" className="hover:text-[#c62828]">Contáctanos</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-[#b71c1c] text-white text-center text-xs py-4">
        © {new Date().getFullYear()} Autofiltros JC — Todos los derechos reservados
      </div>
    </footer>
  )
}



