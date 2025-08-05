import { NextResponse, NextRequest } from 'next/server'
import { User } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireRouteAuth } from '@/lib/requireRouteAuth'
import stripe from '@/lib/stripe'


// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const POST = handler

async function handler(req: Request) {
  try {
    const body = await req.json()
    const priceId = body.priceId as string
    const userId = body.userId as number | null
    const returnUrl = body.returnUrl as string

    let user = null
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    }

    let customerId = user?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
      })

      customerId = customer.id

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        })
      } else {
        // the customer here will be registered in the future
        // TODO: test this works
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      // mode: 'subscription',
      mode: 'payment',
      customer: customerId ?? undefined,
      customer_email: !customerId ? user?.email : undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
    })

    const url = `${checkoutSession.url}`

    return NextResponse.json({
      url,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { status: 'error', error: (e as any)?.message },
      { status: 500 },
    )
  }
}
