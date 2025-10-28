import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-[70vh]">
      {/* FRANJA CORPORATIVA CON DEGRADADO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000] via-[#b22222] to-[#d32f2f]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#ffffff20,_transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 py-8 px-4 text-white">
          <img
            src="/images/logoJC.png"
            alt="Autofiltros JC, S.A."
            className="h-28 md:h-36 w-auto object-contain drop-shadow-lg"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              Autofiltros JC, S.A.
            </h2>
            <p className="text-gray-100 text-sm md:text-base mt-1 max-w-md">
              “Filtros y accesorios automotrices de calidad, al alcance de todos.”
            </p>
          </div>
        </div>
      </section>

      {/* LÍNEA DIVISORIA METÁLICA */}
      <div className="relative h-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px]" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10" />
      </div>

      {/* SECCIÓN INSTITUCIONAL (E-COMMERCE) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <h3 className="text-2xl font-bold">¿Quiénes somos?</h3>
            <p className="text-gray-700 mt-2 max-w-3xl">
              Somos un <b>e-commerce guatemalteco especializado en filtración automotriz</b>.
              Ofrecemos <b>catálogo verificado</b>, <b>precio justo</b> y una <b>experiencia de compra simple </b> 
              con <b>asesoría técnica</b> y <b>envíos a todo el país</b>. Atendemos a talleres, flotillas y público en
              general, trabajando con <b>marcas de confianza</b> y un inventario validado para garantizar
              compatibilidad y calidad.
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              🎯 <span>Misión</span>
            </h4>
            <p className="text-gray-700 mt-2">
              Proveer soluciones en filtros y accesorios con <b>calidad garantizada</b>, asesoría técnica
              y logística eficiente para mantener los vehículos en su mejor desempeño.
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              🚀 <span>Visión</span>
            </h4>
            <p className="text-gray-700 mt-2">
              Ser el <b>e-commerce líder de filtros y accesorios en Guatemala</b> por <b>catálogo confiable</b>, <b>experiencia de compra simple</b>
              y <b>atención excepcional</b>.
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              🤝 <span>Valores</span>
            </h4>
            <ul className="text-gray-700 mt-2 list-disc pl-5 space-y-1">
              <li>Honestidad y precio justo</li>
              <li>Rapidez y cumplimiento</li>
              <li>Asesoría técnica</li>
              <li>Orientación al cliente</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFICIOS / CONFIANZA */}
      <section className="bg-gradient-to-b from-[#eaf6ff] to-[#d6ecff]">
        <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold flex items-center gap-2">
              🚚 <span>Envíos a todo el país</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Cobertura nacional con aliados logísticos.</p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold flex items-center gap-2">
              💳 <span>Pago seguro</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Stripe (test) y métodos locales próximamente.</p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold flex items-center gap-2">
              🏷️ <span>Marcas reconocidas</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">A1, Kayser, Master, Seineca, Syntecfil…</p>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold flex items-center gap-2">
              🧰 <span>Asesoría técnica</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Soporte para compatibilidades y aplicaciones.</p>
          </div>
        </div>
      </section>

      {/* CTA / ACCESO RÁPIDO */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold">Encuentra el filtro correcto en minutos</h3>
            <p className="text-gray-700 mt-2">
              Busca por marca, SKU o compatibilidad. Catálogo en crecimiento continuo.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="/catalogo" className="bg-black text-white rounded-lg px-5 py-2 hover:opacity-90">
                Ver catálogo
              </a>
              <a href="/nosotros" className="border rounded-lg px-5 py-2 hover:bg-gray-50">
                Conócenos
              </a>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <a href="/catalogo?categoria=filtros" className="rounded-xl border p-4 hover:shadow-sm">
              <div className="font-semibold">Filtros</div>
              <div className="text-sm text-gray-600">Aire · Aceite · Cabina · Combustible · Caja Automatica</div>
            </a>
            <a href="/catalogo?categoria=accesorios" className="rounded-xl border p-4 hover:shadow-sm">
              <div className="font-semibold">Accesorios</div>
              <div className="text-sm text-gray-600">Limpiadores, adaptadores, etc.</div>
            </a>
            <a href="/catalogo?marca=1" className="rounded-xl border p-4 hover:shadow-sm">
              <div className="font-semibold">Marcas</div>
              <div className="text-sm text-gray-600">Busca por fabricante</div>
            </a>
            <a href="/carrito" className="rounded-xl border p-4 hover:shadow-sm">
              <div className="font-semibold">Mi carrito</div>
              <div className="text-sm text-gray-600">Revisa tu pedido</div>
            </a>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-200px,#5fb0ff,transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-xs font-medium tracking-widest px-2 py-1 rounded-full bg-black text-white">
                Autofiltros JC
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                Filtros y accesorios automotrices en Guatemala
              </h1>
              <p className="mt-4 text-gray-700 max-w-prose">
                Catálogo actualizado, pagos seguros y envíos a todo el país. Somos especialistas en filtros de aire,
                aceite, cabina, gasolina y caja automática.
              </p>

              <div className="mt-6 flex gap-3">
                <Link href="/catalogo" className="px-5 py-2.5 rounded-lg bg-black text-white text-sm hover:opacity-90">
                  Ver catálogo
                </Link>
                <a href="#contacto" className="px-5 py-2.5 rounded-lg border text-sm hover:bg-gray-50">
                  Contactar
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2"><span>🛒</span> Pago con Stripe (modo test)</div>
                <div className="flex items-center gap-2"><span>🚚</span> Envíos a todo el país</div>
                <div className="flex items-center gap-2"><span>🔄</span> Devoluciones fáciles</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/70 p-4 flex items-center justify-center">
              <img
                src="/images/logoJC.png"
                alt="Autofiltros JC, S.A."
                className="w-full max-w-md md:max-w-lg mx-auto h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS DESTACADAS */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold">Categorías destacadas</h2>
        <p className="text-gray-600 text-sm mt-1">Explora rápidamente lo que más se busca.</p>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Filtros de Aire', qs: 'categoria=filtros-de-aire' },
            { name: 'Filtros de Aceite', qs: 'categoria=filtros-de-aceite' },
            { name: 'Filtros de Cabina', qs: 'categoria=filtros-de-cabina' },
            { name: 'Caja Automática', qs: 'categoria=filtro-de-caja-automatica' },
          ].map((c) => (
            <Link key={c.name} href={`/catalogo?${c.qs}`} className="rounded-xl border p-4 hover:shadow-sm bg-white/70">
              <div className="text-3xl">🧰</div>
              <div className="mt-2 font-medium">{c.name}</div>
              <div className="text-xs text-gray-600">Ver productos →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICIOS Y PORTAFOLIO (reemplaza el 2º “Quiénes somos”) */}
      <section className="bg-[#d6ecff]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold">Servicios y portafolio</h2>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-2xl">🧑‍🔧</div>
              <h3 className="mt-2 font-semibold">Servicios</h3>
              <p className="text-gray-700 text-sm mt-1">
                Contamos con un eficaz y comprometido equipo de colaboradores especializados, con el objetivo de brindar
                <b> atención, asesoramiento y soluciones</b> que nuestros clientes se merecen.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-2xl">🧩</div>
              <h3 className="mt-2 font-semibold">Productos</h3>
              <p className="text-gray-700 text-sm mt-1">
                Portafolio para <b>marcas europeas, americanas, japonesas y coreanas</b> en vehículos recientes y
                antiguos; <b>próximamente</b> líneas china e india.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-2xl">🚚</div>
              <h3 className="mt-2 font-semibold">Cobertura y atención</h3>
              <p className="text-gray-700 text-sm mt-1">
                Envíos a todo Guatemala con aliados logísticos. Atención a talleres, flotillas y público en general.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold">¿Por qué comprar con nosotros?</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: 'Compatibilidad clara', d: 'SKU, marca/modelo y asesoría técnica.' },
            { t: 'Precios justos', d: 'Transparencia y promos regulares.' },
            { t: 'Pagos seguros', d: 'Stripe (modo test en desarrollo).' },
            { t: 'Soporte humano', d: 'Te ayudamos a elegir lo correcto.' },
          ].map((b) => (
            <div key={b.t} className="rounded-xl border p-4 bg-white/70">
              <div className="text-2xl">✅</div>
              <div className="mt-2 font-medium">{b.t}</div>
              <div className="text-xs text-gray-600 mt-1">{b.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border bg-black text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Encuentra tu filtro ideal</h3>
            <p className="text-white/80 text-sm mt-1">Filtra por marca, categoría o busca por código.</p>
          </div>
          <Link href="/catalogo" className="px-5 py-2.5 rounded-lg bg-white text-black text-sm hover:opacity-90">
            Ir al catálogo
          </Link>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="border-t bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-xl md:text-2xl font-bold">Contacto</h2>
          <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border bg-white p-4">
              <div className="font-medium">Teléfono</div>
              <div className="text-gray-700">
                <a href="tel:+50244984479" className="underline hover:text-emerald-600">
                  +502 4498 4479
                </a>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="font-medium">Email</div>
              <div className="text-gray-700">ventas@grupojcautomotriz.com</div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="font-medium">Horario</div>
              <div className="text-gray-700">Lun–Sáb 8:00–18:00</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

