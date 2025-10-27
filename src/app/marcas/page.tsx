import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo' // ⬅️ importa el cliente

type SP = { marca?: string }

export const metadata = {
  title: 'Marcas | Autofiltros JC',
  description: 'Explora las marcas disponibles en Autofiltros JC.',
}

export default async function MarcasPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  if (sp.marca) {
    const id = Number(sp.marca)
    if (Number.isFinite(id)) redirect(`/catalogo?marca=${id}`)
  }

  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="rounded-2xl border bg-white/80 backdrop-blur p-6 mb-6">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <p className="text-sm text-gray-600 mt-1">
          Trabajamos con fabricantes confiables. Elige una marca para ver sus productos.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <Link
  key={b.id}
  href={`/catalogo?marca=${b.id}`}
  className="group rounded-2xl border bg-white/80 p-4 transition
             hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300
             active:translate-y-0 active:shadow-md"
>
  <div className="flex items-center gap-3">
    {/* Logo con un borde que se acentúa en hover */}
    <BrandLogo
      name={b.name}
      // @ts-expect-error si tienes slug en Brand úsalo
      slug={b.slug}
      boxClassName="transition group-hover:ring-1 group-hover:ring-gray-200"
    />

    <div className="min-w-0">
      <div className="font-medium leading-5 truncate group-hover:text-gray-900">
        {b.name}
      </div>
      <div className="text-xs text-gray-600">
        {b._count.products} producto{b._count.products === 1 ? '' : 's'}
      </div>
    </div>
  </div>

  {/* CTA con cambio sutil en hover como en ProductCard */}
  <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-700">
    Ver productos →
  </div>
</Link>
        ))}
      </section>
    </main>
  )
}


