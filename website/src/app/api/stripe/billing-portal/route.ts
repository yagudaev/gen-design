import { NextResponse, NextRequest } from 'next/server'
import { User } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireRouteAuth } from '@/lib/requireRouteAuth'
import stripe from '@/lib/stripe'


// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const POST = requireRouteAuth(handler)

async function handler(req: Request, user: User, userId: number) {
  try {
    const body = await req.json()
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        {
          error: "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 },
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: body.returnUrl,
    })

    const url = portalSession.url

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
