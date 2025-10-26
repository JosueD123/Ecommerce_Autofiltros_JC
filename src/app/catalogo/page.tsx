import ProductCard from '@/components/ProductCard'
import FilterChips from '@/components/FilterChips'
import SortSelect from '@/components/SortSelect'
import SidebarBrandTrust from '@/components/SidebarBrandTrust' // ⬅️ NUEVO
import { prisma } from '@/lib/prisma'

type SP = { q?: string; marca?: string; categoria?: string; sort?: string; page?: string }

const PAGE_SIZE = 12

export default async function Catalogo({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const q = (sp.q ?? '').trim()
  const marca = sp.marca ? Number(sp.marca) : undefined
  const categoria = sp.categoria ? Number(sp.categoria) : undefined
  const sort = sp.sort ?? 'new'
  const page = Math.max(1, Number(sp.page ?? '1') || 1)

  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  // where
  const where: any = {}
  if (marca) where.brandId = marca
  if (categoria) where.categoryId = categoria
  if (q) where.OR = [{ name: { contains: q } }, { sku: { contains: q } }]

  // orderBy
  const orderBy =
    sort === 'price_asc'
      ? { price: 'asc' as const }
      : sort === 'price_desc'
      ? { price: 'desc' as const }
      : { createdAt: 'desc' as const }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { images: true, brand: true, category: true },
      orderBy,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.product.count({ where: Object.keys(where).length ? where : undefined }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Helpers URL
  const baseParams = new URLSearchParams()
  if (q) baseParams.set('q', q)
  if (marca) baseParams.set('marca', String(marca))
  if (categoria) baseParams.set('categoria', String(categoria))

  function linkWith(extra: Record<string, string | number | undefined>) {
    const p = new URLSearchParams(baseParams.toString())
    Object.entries(extra).forEach(([k, v]) => {
      if (v === undefined || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    const s = p.toString()
    return `/catalogo${s ? `?${s}` : ''}`
  }

  return (
    <main className="p-6 max-w-7xl mx-auto grid md:grid-cols-[260px_1fr] gap-6">
      {/* SIDEBAR FILTROS */}
      <aside className="md:sticky md:top-20 h-max space-y-4">
        {/* Marcas */}
        <details className="group rounded-2xl border bg-white/80 backdrop-blur open:shadow-sm" open={!!marca}>
          <summary className="cursor-pointer select-none px-4 py-2 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">🏷️ Marcas</span>
            <span className="text-xs text-gray-500 group-open:hidden">ver</span>
            <span className="text-xs text-gray-500 hidden group-open:inline">cerrar</span>
          </summary>
          <div className="px-3 pb-3">
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  className={`block rounded-lg px-3 py-1.5 hover:bg-gray-50 ${
                    !marca ? 'font-medium ring-1 ring-gray-200 bg-gray-50' : ''
                  }`}
                  href={linkWith({ marca: undefined, page: 1 })}
                >
                  Todas
                </a>
              </li>
              {brands.map((b) => (
                <li key={b.id}>
                  <a
                    className={`block rounded-lg px-3 py-1.5 hover:bg-gray-50 ${
                      marca === b.id ? 'font-medium ring-1 ring-gray-200 bg-gray-50' : ''
                    }`}
                    href={linkWith({ marca: b.id, page: 1 })}
                  >
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Categorías */}
        <details className="group rounded-2xl border bg-white/80 backdrop-blur open:shadow-sm" open={!!categoria}>
          <summary className="cursor-pointer select-none px-4 py-2 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">🧰 Categorías</span>
            <span className="text-xs text-gray-500 group-open:hidden">ver</span>
            <span className="text-xs text-gray-500 hidden group-open:inline">cerrar</span>
          </summary>
          <div className="px-3 pb-3">
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  className={`block rounded-lg px-3 py-1.5 hover:bg-gray-50 ${
                    !categoria ? 'font-medium ring-1 ring-gray-200 bg-gray-50' : ''
                  }`}
                  href={linkWith({ categoria: undefined, page: 1 })}
                >
                  Todas
                </a>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    className={`block rounded-lg px-3 py-1.5 hover:bg-gray-50 ${
                      categoria === c.id ? 'font-medium ring-1 ring-gray-200 bg-gray-50' : ''
                    }`}
                    href={linkWith({ categoria: c.id, page: 1 })}
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Extras actuales */}
        <div className="space-y-3 pt-2">
          {/* Ayuda / WhatsApp */}
          <div className="rounded-2xl border bg-white/80 p-4">
            <div className="text-sm font-semibold flex items-center gap-2">🧑‍🔧 ¿Necesitas ayuda?</div>
            <p className="text-xs text-gray-600 mt-1">
              Te apoyamos a elegir el filtro correcto o validar compatibilidad.
            </p>
            <a
              href="https://wa.me/50244984479?text=Hola%20Autofiltros%20JC%2C%20necesito%20ayuda%20con%20un%20filtro."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center w-full rounded-lg bg-emerald-600 text-white text-sm py-2 hover:opacity-90"
            >
              💬 Chatear por WhatsApp
            </a>
          </div>

          {/* Envíos */}
          <div className="rounded-2xl border bg-white/80 p-4">
            <div className="text-sm font-semibold flex items-center gap-2">🚚 Envíos a todo el país</div>
            <p className="text-xs text-gray-600 mt-1">
              Trabajamos con aliados logísticos. Entregas ágiles y seguimiento.
            </p>
          </div>

          {/* Pago seguro */}
          <div className="rounded-2xl border bg-white/80 p-4">
            <div className="text-sm font-semibold flex items-center gap-2">💳 Pago seguro</div>
            <p className="text-xs text-gray-600 mt-1">Stripe en modo test y métodos locales próximamente.</p>
          </div>

          {/* Horario */}
          <div className="rounded-2xl border bg-white/80 p-4">
            <div className="text-sm font-semibold flex items-center gap-2">🕘 Horario</div>
            <p className="text-xs text-gray-600 mt-1">Lun–Sáb 8:00–18:00</p>
            <div className="mt-2 text-xs">
              <a href="tel:+50244984479" className="underline">
                Tel: +502 4498 4479
              </a>
              <br />
              <a href="mailto:ventas@autofiltrosjc.com" className="underline">
                ventas@grupojcautomotriz.com
              </a>
            </div>
          </div>
        </div>

        {/* ✅ NUEVO: Marcas destacadas + Confianza */}
        <SidebarBrandTrust />
      </aside>

      {/* CONTENIDO */}
      <section>
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
            <div className="text-xs text-gray-600 mt-0.5">
              {total} resultado{total === 1 ? '' : 's'}
              {q && <> · búsqueda: “{q}”</>}
              {marca && <> · marca</>}
              {categoria && <> · categoría</>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={linkWith({ q: undefined, marca: undefined, categoria: undefined, page: 1 })}
              className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50"
              title="Quitar filtros"
            >
              Limpiar filtros
            </a>
            <div className="text-sm">
              <SortSelect initial={sort} />
            </div>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

        {/* Chips de filtros activos */}
        <FilterChips />

        {products.length === 0 ? (
          <div className="rounded-2xl border p-8 bg-white/70 text-center">
            <div className="text-3xl mb-2">🔎</div>
            <div className="font-medium">No encontramos resultados</div>
            <p className="text-sm text-gray-600 mt-1">Intenta con otro término, o limpia los filtros.</p>
            <a
              href={linkWith({ q: undefined, marca: undefined, categoria: undefined, page: 1 })}
              className="inline-block mt-4 text-sm px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Limpiar filtros
            </a>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={Number(p.price)}
                  images={p.images}
                  stock={p.stock}
                  createdAt={p.createdAt.toISOString?.()}
                />
              ))}
            </div>

            {/* Paginación numerada */}
            <nav className="mt-8 flex items-center justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <a
                  key={pNum}
                  href={linkWith({ page: pNum })}
                  className={`px-3 py-1.5 rounded-lg border text-sm ${
                    pNum === page ? 'bg-black text-white border-black' : 'hover:bg-gray-50'
                  }`}
                >
                  {pNum}
                </a>
              ))}
            </nav>
          </>
        )}
      </section>
    </main>
  )
}














