'use client'

type Brand = { name: string; logo: string; href?: string }

const BRANDS: Brand[] = [
  { name: 'Syntecfil', logo: '/brands/syntecfil.png' },
  { name: 'Ozama',     logo: '/brands/ozama.png' },
  { name: 'Kayser',    logo: '/brands/kayser.png' },
  { name: 'A1',    logo: '/brands/a1.png' },
  { name: 'Seineca',   logo: '/brands/seineca.png' },
  { name: 'Top Gear',   logo: '/brands/top-gear.png' },
]

export default function SidebarBrandTrust() {
  return (
    <>
      {/* Marcas destacadas */}
      <div className="border rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-sm mb-2">🏷️ Marcas más vendidas</h3>

        <div className="grid grid-cols-3 gap-3">
          {BRANDS.map((b) => (
            <a
              key={b.name}
              href={b.href ?? `/catalogo?marca=${encodeURIComponent(b.name)}`}
              className="group block"
              title={b.name}
            >
              <div className="aspect-[4/3] rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-10 max-w-[90%] object-contain opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition"
                  onError={(e) => {
                    // Fallback simple si falta el logo: muestra solo el nombre
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const parent = el.parentElement
                    if (parent && !parent.querySelector('span')) {
                      const s = document.createElement('span')
                      s.className = 'text-xs font-medium text-gray-600'
                      s.textContent = b.name
                      parent.appendChild(s)
                    }
                  }}
                />
              </div>
            </a>
          ))}
        </div>

        <a
          href="/marcas"
          className="block text-center text-xs mt-3 text-gray-600 hover:underline"
        >
          Ver todas las marcas
        </a>
      </div>

      {/* Confianza / valor */}
      <div className="border rounded-xl p-4 text-sm text-gray-700">
        <h3 className="font-semibold mb-2">⭐ Clientes satisfechos en toda Guatemala</h3>
        <ul className="space-y-1">
          <li>🚚 Entregas rápidas a talleres y empresas</li>
          <li>🧪 Catálogo verificado y asesoría técnica</li>
          <li>🔒 Pagos seguros (Stripe – modo test)</li>
        </ul>
      </div>
    </>
  )
}
