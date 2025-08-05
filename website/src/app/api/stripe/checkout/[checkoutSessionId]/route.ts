import { NextResponse, NextRequest } from 'next/server'

import { prisma } from '@/lib/db'
import stripe from '@/lib/stripe'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const POST = handler

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ checkoutSessionId: string }> },
) {
  try {
    const body = await req.json()
    const { checkoutSessionId } = await params

    const checkoutSession =
      await stripe.checkout.sessions.retrieve(checkoutSessionId)
    const email = checkoutSession.customer_details?.email
    const name = checkoutSession.customer_details?.name

    return NextResponse.json({
      email,
      name,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { status: 'error', error: (e as any)?.message },
      { status: 500 },
    )
  }
}
