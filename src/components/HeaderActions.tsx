'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import CartDrawer from './CartDrawer'

type Me =
  | {
      id: number
      name: string
      email: string
      role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
    }
  | null

export default function HeaderActions() {
  const pathname = usePathname()
  const inAdminArea = pathname.startsWith('/admin')

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<Me>(null)
  const [open, setOpen] = useState(false)

  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Evitar mismatch
  useEffect(() => setMounted(true), [])

  // Cargar sesión
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const d = await res.json()
        setUser(d?.authenticated ? d.user : null)
      } catch {
        setUser(null)
      }
    }
    load()
  }, [])

  // Cerrar al hacer click fuera o con ESC
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    window.location.href = '/'
  }

  // En el layout /admin ocultamos acciones de cliente
  if (inAdminArea) return null
  if (!mounted) return <div className="w-[240px] h-8" />

  // Avatar con iniciales
  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.slice(0, 2)
      ?.map((s) => s[0]?.toUpperCase() || '')
      ?.join('') || 'US'

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex items-center gap-3">
      <CartDrawer />

      {/* Botón rápido al panel admin (sólo admins) */}
      {isAdmin && (
        <Link
          href="/admin/productos"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/15"
          aria-label="Ir al panel de administración"
          title="Panel Admin"
        >
          🛠️ Admin
        </Link>
      )}

      {user ? (
        <div className="relative">
          <button
            ref={btnRef}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen((v) => !v)
              }
            }}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-full border border-white/40 px-2 py-1 hover:bg-white/10 transition bg-white/10"
          >
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold text-sm shadow-sm"
              style={{
                background:
                  'linear-gradient(135deg, #8b0000 0%, #b22222 50%, #d32f2f 100%)',
              }}
              aria-hidden
            >
              {initials}
            </span>
            <span className="hidden sm:block text-sm text-white/90">
              {user.name.split(' ')[0]}
            </span>
            <svg
              className={`w-4 h-4 text-white/80 transition ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.976a.75.75 0 111.08 1.04l-4.24 4.54a.75.75 0 01-1.08 0l-4.24-4.54a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {open && (
            <div
              ref={menuRef}
              role="menu"
              // Forzamos texto oscuro para no heredar el text-white del header
              className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-600">{user.email}</div>
              </div>

              <nav className="py-1 text-sm">
                {/* Enlace admin dentro del menú (sólo admins) */}
                {isAdmin && (
                  <Link
                    href="/admin/productos"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <span>🛠️</span> Panel Admin
                  </Link>
                )}

                <Link
                  href="/cuenta"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <span>👤</span> Mi cuenta
                </Link>
                <Link
                  href="/pedidos"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <span>🧾</span> Mis pedidos
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <span>↩</span> Salir
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="text-sm text-white">
          Ingresar
        </Link>
      )}
    </div>
  )
}




