// src/app/producto/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from './AddToCartButton'
import Breadcrumbs from '@/components/Breadcrumbs'
import Tabs from '@/components/Tabs'
import Compatibilidad from './Compatibilidad' // ⬅️ NUEVO

type Props = { params: Promise<{ slug: string }> }

export default async function Producto({ params }: Props) {
  const { slug } = await params

  const p = await prisma.product.findFirst({
    where: { slug },
    include: { images: true, brand: true, category: true },
  })
  if (!p) return <main className="p-6">No encontrado</main>

  // Serializable para Client Components
  const price = Number(p.price)
  const img = p.images?.[0]?.url as string | undefined

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { href: '/', label: 'Inicio' },
          { href: '/catalogo', label: 'Catálogo' },
          { href: `/catalogo?categoria=${encodeURIComponent(p.category.name)}`, label: p.category.name },
          { label: p.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-xl p-4">
          {img ? (
            <img src={img} alt={p.name} className="w-full h-auto" />
          ) : (
            <div className="aspect-square flex items-center justify-center text-sm text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-1">{p.name}</h1>
          <p className="text-sm text-gray-500 mb-2">
            Marca: <span className="font-medium text-gray-700">{p.brand.name}</span> ·{' '}
            Categoría: <span className="font-medium text-gray-700">{p.category.name}</span>
          </p>

          <p className="text-2xl font-semibold mb-4">Q {price.toFixed(2)}</p>

          <div className="flex items-center gap-3 mb-6">
            <AddToCartButton item={{ id: p.id, name: p.name, slug: p.slug, price, img }} />
            <a href="/carrito" className="px-4 py-2 rounded-lg border">Ver carrito</a>
          </div>

          <Tabs
            items={[
              {
                key: 'desc',
                label: 'Descripción',
                content: <p className="text-gray-700">{p.description || '—'}</p>,
              },
              {
                key: 'specs',
                label: 'Especificaciones',
                content: (
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>SKU:</strong> {p.sku}</li>
                    <li><strong>Stock:</strong> {p.stock}</li>
                    <li><strong>Estado:</strong> {p.status}</li>
                    <li><strong>OEM:</strong> {p.oemCode || '—'}</li>
                  </ul>
                ),
              },
              {
                key: 'fit',
                label: 'Compatibilidad',
                content: <Compatibilidad productId={p.id} />, // ⬅️ AQUÍ
              },
            ]}
          />
        </div>
      </div>
    </main>
  )
}






