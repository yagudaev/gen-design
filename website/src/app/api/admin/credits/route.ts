import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'
import { CreditStats } from '@/types'

export const GET = requireAdminRouteAuth(getHandler)

async function getHandler() {
  // Credit functionality has been removed from the User model
  // Return zero values for all credit stats
  return NextResponse.json({
    totalCredits: 0,
    usedCredits: 0,

    freeTotalCredits: 0,
    freeTotalUsedCredits: 0,

    paidTotalCredits: 0,
    paidTotalUsedCredits: 0,
  } as CreditStats)
}
