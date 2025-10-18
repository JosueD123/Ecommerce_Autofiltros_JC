import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Direcciones() {
  const me = await getSessionUser()
  if (!me) redirect('/login?next=/cuenta/direcciones')

  const addresses = await prisma.address.findMany({
    where: { userId: me.id },
    orderBy: { id: 'desc' },
  })

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis direcciones</h1>
        <Link href="/cuenta/direcciones/nueva" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
          + Agregar dirección
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border p-4 text-sm">Aún no tienes direcciones creadas.</div>
      ) : (
        <div className="space-y-3">
          {addresses.map(a => (
            <div key={a.id} className="rounded-2xl border p-4 bg-white/80">
              <div className="font-medium">{a.label || 'Dirección'}</div>
              <div className="text-sm text-gray-700">
                {a.line1}{a.line2 ? `, ${a.line2}` : ''} — {a.city}{a.state ? `, ${a.state}` : ''} {a.zip || ''}{a.phone ? ` · Tel: ${a.phone}` : ''}
              </div>
              <div className="mt-3 flex gap-2">
                {/* Si quieres edición, crea /cuenta/direcciones/[id] */}
                <form action={`/api/addresses/${a.id}`} method="post" className="inline">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button
                    formAction={`/api/addresses/${a.id}`}
                    formMethod="DELETE"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
