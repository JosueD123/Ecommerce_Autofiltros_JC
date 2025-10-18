import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Usa tu versión estable. Si la tuya te daba TS error, puedes omitir apiVersion y Stripe usará la de la cuenta.
  // apiVersion: '2025-07-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { items, email, shipping } = (await req.json()) as {
      email: string
      items: { id: number; name: string; price: number; qty: number }[]
      shipping?: any
    }

    if (!items?.length) {
      return NextResponse.json({ message: 'Carrito vacío' }, { status: 400 })
    }
    if (!email || !String(email).trim()) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 })
    }

    const me = await getSessionUser().catch(() => null)
    const userId = me?.id ?? null

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(i => ({
      price_data: {
        currency: 'gtq',
        product_data: { name: i.name },
        unit_amount: Math.round(Number(i.price) * 100),
      },
      quantity: i.qty,
    }))

    const amountQ = items.reduce((s, i) => s + Number(i.price) * i.qty, 0)

    const order = await prisma.order.create({
      data: {
        email,          // 👈 SIEMPRE el email del formulario
        userId,         // si hay sesión, se vincula
        total: amountQ,
        currency: 'GTQ',
        status: 'PENDING',
        // Si guardas shipping en DB, mapea aquí los campos de `shipping`
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

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${base}/checkout/success?o=${order.id}`,
      cancel_url: `${base}/checkout/cancel?o=${order.id}`,
      metadata: { orderId: String(order.id) },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}
