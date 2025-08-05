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

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 400 },
      )
    }

    // Stripe customer ID functionality has been removed
    return NextResponse.json(
      {
        error: "Billing portal is not available.",
      },
      { status: 400 },
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { status: 'error', error: (e as any)?.message },
      { status: 500 },
    )
  }
}
