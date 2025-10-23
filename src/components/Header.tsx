// src/components/Header.tsx
'use client'

import Link from 'next/link'
import HeaderActions from './HeaderActions'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="font-bold">Autofiltros JC</Link>
            <div className="flex-1" />
          </div>
        </header>
      }
    >
      <InnerHeader />
    </Suspense>
  )
}

function InnerHeader() {
  const router = useRouter()
  const qs = useSearchParams()
  const pathname = usePathname()

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isAdmin = pathname.startsWith('/admin')

  // ====== BUSCADOR (solo público) ======
  const [q, setQ] = useState('')
  useEffect(() => {
    if (!isAdmin) setQ(qs.get('q') ?? '')
  }, [qs, isAdmin])

  useEffect(() => {
    if (isAdmin) return
    if (!pathname.startsWith('/catalogo')) return
    const t = setTimeout(() => {
      const params = new URLSearchParams(qs.toString())
      if (q) params.set('q', q)
      else params.delete('q')
      const url = `/catalogo${params.toString() ? `?${params.toString()}` : ''}`
      router.replace(url)
    }, 300)
    return () => clearTimeout(t)
  }, [q, pathname, qs, router, isAdmin])

  // resaltar link activo en admin (AGREGAMOS 'analytics')
  const adminActive = useMemo(() => {
    if (!isAdmin) return ''
    if (pathname.startsWith('/admin/pedidos')) return 'pedidos'
    if (pathname.startsWith('/admin/marcas')) return 'marcas'
    if (pathname.startsWith('/admin/categorias')) return 'categorias'
    if (pathname.startsWith('/admin/analytics')) return 'analytics'
    return 'productos'
  }, [pathname, isAdmin])

  async function logout() {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
    window.location.href = '/'
  }

  const baseShell = 'sticky top-0 z-40 w-full border-b backdrop-blur'
  const stableFirstPaint = `${baseShell} bg-white/70`
  const desired =
    isAdmin
      ? `${baseShell} bg-slate-900/95 border-slate-800 text-white`
      : `${baseShell} bg-gradient-to-r from-[#b71c1c] via-[#c62828] to-[#d32f2f] text-white`
  const headerClass = mounted ? desired : stableFirstPaint

  return (
    <header className={headerClass} suppressHydrationWarning>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href={isAdmin ? '/admin/productos' : '/'} className="font-bold">
          Autofiltros JC
        </Link>

        {/* ====== MENÚ ADMIN ====== */}
        {isAdmin ? (
          <>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/productos"  className={adminActive === 'productos'  ? 'font-semibold underline' : undefined}>Productos</Link>
              <Link href="/admin/marcas"     className={adminActive === 'marcas'     ? 'font-semibold underline' : undefined}>Marcas</Link>
              <Link href="/admin/categorias" className={adminActive === 'categorias' ? 'font-semibold underline' : undefined}>Categorías</Link>
              <Link href="/admin/pedidos"    className={adminActive === 'pedidos'    ? 'font-semibold underline' : undefined}>Pedidos</Link>
              {/* NUEVO: enlace al panel de estadísticas */}
              <Link href="/admin/analytics"  className={adminActive === 'analytics'  ? 'font-semibold underline' : undefined}>Estadísticas</Link>
            </nav>

            <div className="flex-1" />
            <button
              onClick={logout}
              className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10"
            >
              Salir
            </button>
          </>
        ) : (
          /* ====== MENÚ PÚBLICO ====== */
          <>
            <nav className="hidden md:flex gap-4 text-sm">
              <Link className="hover:underline" href="/catalogo?categoria=filtros">Filtros</Link>
              <Link className="hover:underline" href="/catalogo?categoria=accesorios">Accesorios</Link>
            </nav>

            <div className="flex-1" />

            {/* Buscador con icono de lupa */}
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
                />
              </svg>

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por código, marca o modelo…"
                aria-label="Buscar productos"
                className="w-72 border rounded-lg pl-9 pr-3 py-1.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* Acciones: carrito + menú de usuario (avatar) */}
            <HeaderActions />
          </>
        )}
      </div>
    </header>
  )
}

