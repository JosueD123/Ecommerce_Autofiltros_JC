'use client'

import { useCart } from '@/store/cart'
import { useToast } from '@/components/Toast'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Step = 1 | 2 | 3

type Shipping = {
  name: string
  email: string
  phone?: string
  line1: string
  line2?: string
  city: string
  state?: string
  zip?: string
  notes?: string
}

function formatQ(n: number) {
  return `Q ${n.toFixed(2)}`
}

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`rounded-2xl border bg-white/90 backdrop-blur shadow-sm ${className}`}>{children}</div>
)

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-2xl font-bold tracking-tight">{children}</h1>
)

const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    {...props}
    className={`rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-40 ${className}`}
  />
)

const OutlineBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    {...props}
    className={`rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 ${className}`}
  />
)

const TextLink = (props: React.ComponentProps<typeof Link>) => (
  <Link {...props} className={`underline ${props.className ?? ''}`} />
)

export default function Checkout() {
  const { items, remove, clear } = useCart()
  const { show } = useToast()
  const [step, setStep] = useState<Step>(1)

  // SIEMPRE vacío al inicio
  const [form, setForm] = useState<Shipping>({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  })

  const [isAuth, setIsAuth] = useState(false)

  // 1) Autocompletar con usuario autenticado (si existe)
  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (!mounted) return
        if (d?.authenticated && d.user) {
          setIsAuth(true)
          setForm(f => ({
            ...f,
            name: f.name || d.user.name || '',
            email: f.email || d.user.email || '',
          }))
        } else {
          setIsAuth(false)
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  // 2) Si hay sesión, intenta autocompletar con la primera dirección guardada
  useEffect(() => {
    if (!isAuth) return
    let mounted = true
    fetch('/api/addresses', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!mounted || !d) return
        const a = d?.addresses?.[0]
        if (a) {
          setForm(f => ({
            ...f,
            line1: f.line1 || a.line1,
            line2: f.line2 || a.line2 || '',
            city:  f.city  || a.city,
            state: f.state || a.state || '',
            zip:   f.zip   || a.zip   || '',
            phone: f.phone || a.phone || '',
          }))
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [isAuth])

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  )

  useEffect(() => {
    if (items.length === 0) setStep(1)
  }, [items.length])

  const canGoStep2 = items.length > 0
  const canGoStep3 =
    !!form.name.trim() && !!form.email.trim() && !!form.line1.trim() && !!form.city.trim()

  async function pay() {
    if (!canGoStep3) {
      show({ title: 'Completa tus datos', desc: 'Revisa los campos requeridos.' })
      return
    }

    const res = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        shipping: form,
      }),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok && j.url) {
      window.location.href = j.url
    } else {
      show({ title: 'Error iniciando pago', desc: j.message || 'Intenta nuevamente' })
    }
  }

  const progress = ((step - 1) / 2) * 100

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <section className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#e8f1ff,transparent_40%),radial-gradient(800px_240px_at_-10%_-50%,#dbeafe,transparent)]" />
        <div className="relative px-5 py-6 flex items-center gap-3">
          <div className="text-2xl">🧾</div>
          <div>
            <SectionTitle>Checkout</SectionTitle>
            <p className="text-sm text-gray-600">Revisa tu carrito, ingresa tus datos y realiza el pago seguro.</p>
          </div>
        </div>
      </section>

      <section className="mt-4 mb-8">
        <div className="relative flex flex-col items-center">
          <div className="absolute top-6 w-full h-[3px] bg-gray-200 rounded-full">
            <div
              className="h-[3px] bg-gradient-to-r from-[#8b0000] via-[#b22222] to-[#d32f2f] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="relative z-10 grid grid-cols-3 w-full max-w-3xl text-sm font-medium">
            {[
              ['🛒', 'Carrito', 1],
              ['🧍', 'Datos', 2],
              ['💳', 'Pago', 3],
            ].map(([icon, label, n]) => {
              const num = n as number
              const active = num === step
              const completed = num < step
              return (
                <li key={label} className="flex flex-col items-center text-center">
                  <div
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 text-lg transition-all duration-300
                    ${
                      active
                        ? 'bg-gradient-to-r from-[#8b0000] to-[#d32f2f] text-white border-[#d32f2f] shadow-md scale-110'
                        : completed
                        ? 'bg-[#b22222] text-white border-[#b22222]'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    <span>{icon}</span>
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      active ? 'text-[#b22222] font-semibold'
                      : completed ? 'text-gray-700'
                      : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {step === 1 && (
        <section className="space-y-4">
          {items.length === 0 ? (
            <Card className="p-4 text-sm text-gray-600">
              Tu carrito está vacío. <TextLink href="/catalogo">Ver catálogo</TextLink>
            </Card>
          ) : (
            <>
              <Card className="divide-y">
                {items.map((i) => (
                  <div key={i.id} className="p-4 flex items-center gap-3">
                    {i.img && (
                      <img src={i.img} alt={i.name} className="w-12 h-12 object-contain border rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-1">{i.name}</div>
                      <div className="text-xs text-gray-600">{formatQ(i.price)} × {i.qty}</div>
                    </div>
                    <div className="text-sm font-medium mr-2">{formatQ(i.qty * i.price)}</div>
                    <button
                      onClick={() => { remove(i.id); show({ title: 'Quitado del carrito', desc: i.name }) }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </Card>

              <Card className="p-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Total aproximado (GTQ)</div>
                <div className="text-lg font-semibold">{formatQ(subtotal)}</div>
              </Card>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { clear(); show({ title: 'Carrito vacío' }) }}
                  className="text-sm underline"
                >
                  Vaciar carrito
                </button>
                <div className="flex-1" />
                <PrimaryBtn disabled={!canGoStep2} onClick={() => setStep(2)}>
                  Continuar
                </PrimaryBtn>
              </div>
            </>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <Card className="p-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="border rounded-lg p-2"
                placeholder="Nombre completo *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Email *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Ciudad *"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className="border rounded-lg p-2 md:col-span-2"
                placeholder="Dirección (línea 1) *"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Dirección (línea 2)"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Departamento/Estado"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Código postal"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
              <textarea
                className="border rounded-lg p-2 md:col-span-2"
                placeholder="Notas para la entrega (opcional)"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </Card>

          <div className="flex gap-3">
            <OutlineBtn onClick={() => setStep(1)}>← Volver</OutlineBtn>
            <div className="flex-1" />
            <PrimaryBtn disabled={!canGoStep3} onClick={() => setStep(3)}>
              Continuar
            </PrimaryBtn>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <Card className="divide-y">
            {items.map((i) => (
              <div key={i.id} className="p-4 flex items-center gap-3">
                {i.img && <img src={i.img} alt={i.name} className="w-10 h-10 object-contain border rounded" />}
                <div className="flex-1 text-sm min-w-0 line-clamp-1">{i.name} × {i.qty}</div>
                <div className="text-sm">{formatQ(i.qty * i.price)}</div>
              </div>
            ))}
          </Card>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Card className="p-4">
              <div className="font-semibold mb-1">Datos de contacto</div>
              <div>{form.name}</div>
              <div>{form.email}</div>
              {form.phone && <div>{form.phone}</div>}
            </Card>

            <Card className="p-4">
              <div className="font-semibold mb-1">Envío</div>
              <div>{form.line1}</div>
              {form.line2 && <div>{form.line2}</div>}
              <div>
                {form.city}
                {form.state ? `, ${form.state}` : ''} {form.zip || ''}
              </div>
            </Card>
          </div>

          <Card className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Total aproximado (GTQ)</div>
            <div className="text-lg font-semibold">{formatQ(subtotal)}</div>
          </Card>

          <div className="flex gap-3">
            <OutlineBtn onClick={() => setStep(2)}>← Volver</OutlineBtn>
            <div className="flex-1" />
            <PrimaryBtn onClick={pay}>Pagar con Stripe (test)</PrimaryBtn>
          </div>
        </section>
      )}
    </main>
  )
}
