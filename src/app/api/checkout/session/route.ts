import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // estable
})

type CartItem = { id: number; name: string; price: number; qty: number }

function getBaseUrl(req: NextRequest) {
  // 1) Prioriza la env var (configúrala en Vercel)
  const env = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (env) return env.replace(/\/$/, '')

  // 2) Origin del request
  const origin = req.headers.get('origin')
  if (origin?.startsWith('http')) return origin.replace(/\/$/, '')

  // 3) Fallback a dominio de Vercel (ajústalo si cambias dominio)
  return 'https://ecommerce-autofiltros-jc.vercel.app'
}

export async function POST(req: NextRequest) {
  try {
    const { items, email, shipping } = (await req.json()) as {
      email: string
      items: CartItem[]
      shipping?: any
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Carrito vacío' }, { status: 400 })
    }
    if (!email || !String(email).trim()) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 })
    }

    const me = await getSessionUser().catch(() => null)
    const userId = me?.id ?? null

    // Stripe requiere montos enteros en centavos
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(i => ({
      price_data: {
        currency: 'gtq', // GTQ soportado en STRIPE (monto en centavos)
        product_data: { name: i.name },
        unit_amount: Math.round(Number(i.price) * 100),
      },
      quantity: i.qty,
    }))

    const totalQ = items.reduce((s, i) => s + Number(i.price) * i.qty, 0)

    // 1) Crea orden PENDING
    const order = await prisma.order.create({
      data: {
        email,
        userId,
        total: totalQ,
        currency: 'GTQ',
        status: 'PENDING',
        // Guarda items
        items: {
          create: items.map(i => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
        },
      },
    })

    // 2) Crea sesión de Checkout (URLs absolutas)
    const base = getBaseUrl(req)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items,
      success_url: `${base}/checkout/success?o=${order.id}`,
      cancel_url: `${base}/checkout/cancel?o=${order.id}`,
      metadata: { orderId: String(order.id) },
      // Opcional: pedir dirección de envío si la necesitas
      // shipping_address_collection: { allowed_countries: ['GT', 'US'] },
    })

    // 3) Vincula sesión a la orden
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error('Stripe session error:', e)
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}
