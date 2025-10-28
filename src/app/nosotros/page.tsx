import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros | Autofiltros JC, S.A.',
  description:
    'Conoce a Autofiltros JC, S.A.: Misión, visión y valores. Expertos en filtros y accesorios automotrices en Guatemala.',
}

export default function NosotrosPage() {
  return (
    <main className="min-h-[70vh]">
      {/* HERO corporativo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000] via-[#b22222] to-[#d32f2f]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#ffffff30,_transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 text-white flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/logoJC.png"
            alt="Autofiltros JC, S.A."
            className="h-24 md:h-28 w-auto object-contain drop-shadow"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">Nosotros</h1>
            <p className="text-white/90 mt-1 max-w-2xl">
              En Autofiltros JC, S.A. acercamos <b>filtros y accesorios automotrices</b> de calidad a talleres y
              conductores en toda Guatemala, con servicio cercano y cumplimiento.
            </p>
          </div>
        </div>
      </section>

      {/* Línea divisoria metálica */}
      <div className="relative h-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px]" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10" />
      </div>

      {/* Quiénes somos + Misión / Visión (EMPRESA) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold">¿Quiénes somos?</h2>
            <p className="text-gray-700 mt-2 max-w-4xl">
              Somos una empresa guatemalteca enfocada en <b>filtración y accesorios automotrices</b>, con
              disponibilidad, precio competitivo y <b>servicio técnico</b>. Atendemos a talleres, flotillas y público en
              general en todo el país.
            </p>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <h3 className="font-semibold text-lg flex items-center gap-2">🎯 <span>Misión (empresa)</span></h3>
            <p className="text-gray-700 mt-2">
              Satisfacer las necesidades de nuestros clientes brindando <b>asesoría</b>, garantizando la
              <b> calidad</b> con <b>precios competitivos</b> y logrando el <b>reconocimiento y la confianza</b> en nuestros
              productos.
            </p>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <h3 className="font-semibold text-lg flex items-center gap-2">🚀 <span>Visión (empresa)</span></h3>
            <p className="text-gray-700 mt-2">
              Proveer al sector automotor en Guatemala productos de calidad y <b>servicio personalizado</b>, distribuyendo
              marcas de buena calidad con <b>precios competitivos</b>, enfocados en la <b>innovación</b>.
            </p>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <h3 className="font-semibold text-lg flex items-center gap-2">🤝 <span>Valores</span></h3>
            <ul className="text-gray-700 mt-2 list-disc pl-5 space-y-1">
              <li>Honestidad y precio justo</li>
              <li>Rapidez y cumplimiento</li>
              <li>Asesoría técnica</li>
              <li>Orientación al cliente</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Métricas / confianza */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🚚', t: 'Cobertura nacional', d: 'Envíos a todo el país.' },
            { icon: '🧰', t: 'Catálogo verificado', d: 'Compatibilidad y SKUs claros.' },
            { icon: '💳', t: 'Pago seguro', d: 'Stripe en modo test.' },
            { icon: '⭐', t: 'Atención cercana', d: 'Soporte para elegir bien.' },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border bg-white p-5 flex items-start gap-3">
              <div className="text-2xl leading-none">{i.icon}</div>
              <div>
                <div className="font-semibold">{i.t}</div>
                <div className="text-sm text-gray-600">{i.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto + CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold">Contacto</h2>
            <p className="text-gray-700 mt-2">Estamos para ayudarte.</p>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <div className="font-medium flex items-center gap-2">📞 Teléfono</div>
            <div className="text-gray-700 mt-1">
              <a href="tel:+50244984479" className="underline hover:text-emerald-600">+502 4498 4479</a>
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <div className="font-medium flex items-center gap-2">✉️ Email</div>
            <div className="text-gray-700 mt-1">ventas@grupojcautomotriz.com</div>
          </div>

          <div className="rounded-2xl border p-5 bg-white/70">
            <div className="font-medium flex items-center gap-2">🕘 Horario</div>
            <div className="text-gray-700 mt-1">Lun–Sáb 8:00–18:00</div>
          </div>

          <div className="md:col-span-3 flex items-center justify-between gap-4 rounded-2xl border p-5 bg-black text-white">
            <div>
              <div className="text-lg md:text-xl font-semibold">¿Buscas un filtro específico?</div>
              <div className="text-white/80 text-sm">Filtra por marca, categoría o busca por código.</div>
            </div>
            <Link href="/catalogo" className="px-4 py-2 rounded-lg bg-white text-black text-sm hover:opacity-90">
              Ir al catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Mapa / ubicación */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
          <div className="rounded-2xl border overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d405.76792585922163!2d-90.588536082096!3d14.636811130295536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sgt!4v1760153216696!5m2!1ses-419!2sgt"
              width="100%"
              height="380"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[380px] md:h-[480px] border-0"
              title="Ubicación de Autofiltros JC, S.A."
            />
          </div>
          <p className="text-gray-600 text-sm mt-3">
            📍 Nos encontramos en Mixco, Guatemala. Puedes visitarnos o realizar tus pedidos en línea con envío a todo el país.
          </p>
        </div>
      </section>
    </main>
  )
}



