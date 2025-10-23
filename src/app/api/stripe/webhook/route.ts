import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'           // webhook necesita Node.js, no edge
export const dynamic = 'force-dynamic'    // evita caché para este endpoint
export const preferredRegion = 'home'     // opcional: región “home” en Vercel

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ ok: false }, { status: 400 })

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!whSecret) return NextResponse.json({ ok: false, msg: 'Missing whsec' }, { status: 500 })

  let event: Stripe.Event

  try {
    // OJO: necesitamos el cuerpo RAW (texto)
    const raw = await req.text()
    event = await stripe.webhooks.constructEventAsync(raw, sig, whSecret)
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // guardaste orderId en el metadata al crear la session
        const orderId = Number(session.metadata?.orderId)
        if (Number.isFinite(orderId)) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID', stripeId: session.id },
          })
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = Number(session.metadata?.orderId)
        if (Number.isFinite(orderId)) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          })
        }
        break
      }

      // opcionales, por si quieres cubrir otros casos:
      case 'payment_intent.payment_failed': {
        // podrías buscar la orden por session/payment_intent y marcar CANCELLED
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    // No reconozcas el evento como recibido si tu lógica falló
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
