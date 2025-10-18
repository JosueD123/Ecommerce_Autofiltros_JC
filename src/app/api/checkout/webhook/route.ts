import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature')!
    const buf = Buffer.from(await req.arrayBuffer())
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session

      const orderId = Number(s.metadata?.orderId)
      if (orderId) {
        // Marca pagada y (opcional) descuenta stock
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              // Guarda lo que Stripe envió (por si cambias moneda luego)
              currency: (s.currency || 'gtq').toUpperCase(),
              total: (s.amount_total ?? 0) / 100, // centavos → Q
            },
          })
          const items = await tx.orderItem.findMany({ where: { orderId } })
          for (const it of items) {
            await tx.product.update({
              where: { id: it.productId },
              data: { stock: { decrement: it.qty } },
            })
          }
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }
}
