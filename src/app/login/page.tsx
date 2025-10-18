'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Tab = 'login' | 'register'

export default function LoginRegister() {
  const qs = useSearchParams()
  const initialTab: Tab = (qs.get('tab') as Tab) === 'register' ? 'register' : 'login'
  const [tab, setTab] = useState<Tab>(initialTab)

  // ====== LOGIN ======
  const [lemail, setLemail] = useState('')
  const [lpass, setLpass] = useState('')
  const [lerr, setLerr] = useState('')
  const [lbusy, setLbusy] = useState(false)
  const [lShowPwd, setLShowPwd] = useState(false)

  // ====== REGISTRO ======
  const [rname, setRname] = useState('')
  const [remail, setRemail] = useState('')
  const [rpass, setRpass] = useState('')
  const [rerr, setRerr] = useState('')
  const [rbusy, setRbusy] = useState(false)
  const [rShowPwd, setRShowPwd] = useState(false)

  // Mantener ?tab= sincronizado en la URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const u = new URL(window.location.href)
    u.searchParams.set('tab', tab)
    window.history.replaceState(null, '', u.toString())
  }, [tab])

  // Si ya está autenticado, redirige (evita ver el login)
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d?.authenticated) {
          const next = new URLSearchParams(window.location.search).get('next') || '/cuenta'
          window.location.href = next
        }
      })
      .catch(() => {})
  }, [])

  function validEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v)
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setLerr('')

    if (!validEmail(lemail) || lpass.length < 6) {
      setLerr('Revisa tu email y contraseña (mínimo 6 caracteres).')
      return
    }

    setLbusy(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lemail.trim(), password: lpass })
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLerr(j?.message || 'Credenciales inválidas')
        return
      }
      const next = new URLSearchParams(window.location.search).get('next') || '/cuenta'
      window.location.href = next
    } catch {
      setLerr('Error de red. Intenta de nuevo.')
    } finally {
      setLbusy(false)
    }
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault()
    setRerr('')

    if (!rname.trim() || !validEmail(remail) || rpass.length < 6) {
      setRerr('Completa nombre, email válido y contraseña (mínimo 6).')
      return
    }

    setRbusy(true)
    try {
      // 1) Crear usuario
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rname.trim(), email: remail.trim(), password: rpass })
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setRerr(j?.message || 'No se pudo crear la cuenta')
        return
      }

      // 2) Autologin
      const resLogin = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: remail.trim(), password: rpass })
      })
      const j2 = await resLogin.json().catch(() => ({}))
      if (!resLogin.ok) {
        setTab('login')
        setLemail(remail)
        setLerr(j2?.message || 'Cuenta creada. Inicia sesión.')
        return
      }

      const next = new URLSearchParams(window.location.search).get('next') || '/cuenta'
      window.location.href = next
    } catch {
      setRerr('Error de red. Intenta de nuevo.')
    } finally {
      setRbusy(false)
    }
  }

  const title = useMemo(() => (tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'), [tab])

  return (
    <main className="min-h-[70vh] bg-[radial-gradient(60%_70%_at_20%_-10%,#f3f6ff,transparent),radial-gradient(70%_60%_at_100%_0%,#fff1f1,transparent)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mx-auto max-w-md">
          {/* Card */}
          <div className="relative rounded-2xl border bg-white/80 backdrop-blur shadow-xl">
            {/* Tabs */}
            <div className="grid grid-cols-2 text-sm font-medium">
              <button
                onClick={() => setTab('login')}
                className={`py-3 rounded-tl-2xl ${tab === 'login' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setTab('register')}
                className={`py-3 rounded-tr-2xl ${tab === 'register' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                Crear cuenta
              </button>
            </div>

            <div className="p-6 sm:p-7">
              <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
              <p className="text-sm text-gray-600 mb-5">
                {tab === 'login'
                  ? 'Accede para ver tu cuenta y tus pedidos.'
                  : 'Crea tu cuenta para comprar más rápido y revisar tus pedidos.'}
              </p>

              {/* LOGIN PANEL */}
              {tab === 'login' ? (
                <form onSubmit={doLogin} className="space-y-3">
                  {lerr && (
                    <div className="mb-1 text-sm rounded-lg border border-red-400 bg-red-50 text-red-700 px-3 py-2">
                      {lerr}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Correo electrónico</label>
                    <div className="relative">
                      <input
                        className="w-full border rounded-lg px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="nombre@correo.com"
                        type="email"
                        value={lemail}
                        onChange={(e) => setLemail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <input
                        className="w-full border rounded-lg px-3 py-2 pr-10 pl-9 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="••••••••"
                        type={lShowPwd ? 'text' : 'password'}
                        value={lpass}
                        onChange={(e) => setLpass(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
                      <button
                        type="button"
                        onClick={() => setLShowPwd((s) => !s)}
                        className="absolute right-2.5 top-2 text-xs text-gray-600 hover:text-black"
                      >
                        {lShowPwd ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={lbusy}
                    className="w-full rounded-lg bg-black text-white py-2.5 mt-2 hover:opacity-90 disabled:opacity-40"
                  >
                    {lbusy ? 'Entrando…' : 'Entrar'}
                  </button>
                </form>
              ) : (
                // REGISTER PANEL
                <form onSubmit={doRegister} className="space-y-3">
                  {rerr && (
                    <div className="mb-1 text-sm rounded-lg border border-red-400 bg-red-50 text-red-700 px-3 py-2">
                      {rerr}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Nombre completo</label>
                    <div className="relative">
                      <input
                        className="w-full border rounded-lg px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="Tu nombre"
                        value={rname}
                        onChange={(e) => setRname(e.target.value)}
                        autoComplete="name"
                        required
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">👤</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Correo electrónico</label>
                    <div className="relative">
                      <input
                        className="w-full border rounded-lg px-3 py-2 pl-9 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="nombre@correo.com"
                        type="email"
                        value={remail}
                        onChange={(e) => setRemail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <input
                        className="w-full border rounded-lg px-3 py-2 pr-10 pl-9 outline-none focus:ring-2 focus:ring-black/10"
                        placeholder="Mínimo 6 caracteres"
                        type={rShowPwd ? 'text' : 'password'}
                        value={rpass}
                        onChange={(e) => setRpass(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
                      <button
                        type="button"
                        onClick={() => setRShowPwd((s) => !s)}
                        className="absolute right-2.5 top-2 text-xs text-gray-600 hover:text-black"
                      >
                        {rShowPwd ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">Usa al menos 6 caracteres.</p>
                  </div>

                  <button
                    disabled={rbusy}
                    className="w-full rounded-lg bg-black text-white py-2.5 mt-2 hover:opacity-90 disabled:opacity-40"
                  >
                    {rbusy ? 'Creando cuenta…' : 'Crear cuenta'}
                  </button>
                </form>
              )}

              {/* Pie */}
              <p className="mt-5 text-xs text-gray-500">
                ¿Tienes dudas? Escríbenos a{' '}
                <a className="underline" href="mailto:ventas@autofiltrosjc.com">ventas@autofiltrosjc.com</a>
              </p>
            </div>
          </div>

          {/* Cambio rápido de pestaña */}
          <div className="text-center text-sm mt-4">
            {tab === 'login' ? (
              <>¿No tienes cuenta?{' '}
                <button className="underline" onClick={() => setTab('register')}>
                  Regístrate
                </button>
              </>
            ) : (
              <>¿Ya tienes cuenta?{' '}
                <button className="underline" onClick={() => setTab('login')}>
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}


