import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'
import { CreditStats } from '@/types'

export const GET = requireAdminRouteAuth(getHandler)

async function getHandler() {
  const creditTotals = await prisma.user.aggregate({
    _sum: {
      totalCredits: true,
      usedCredits: true,
    },
  })

  const freeCreditTotals = await prisma.user.aggregate({
    _sum: {
      totalCredits: true,
      usedCredits: true,
    },
    where: {
      plan: 'free',
    },
  })

  const paidCreditTotals = await prisma.user.aggregate({
    _sum: {
      totalCredits: true,
      usedCredits: true,
    },
    where: {
      plan: 'pro',
    },
  })

  return NextResponse.json({
    totalCredits: creditTotals._sum.totalCredits || 0,
    usedCredits: creditTotals._sum.usedCredits || 0,

    freeTotalCredits: freeCreditTotals._sum.totalCredits || 0,
    freeTotalUsedCredits: freeCreditTotals._sum.usedCredits || 0,

    paidTotalCredits: paidCreditTotals._sum.totalCredits || 0,
    paidTotalUsedCredits: paidCreditTotals._sum.usedCredits || 0,
  } as CreditStats)
}
