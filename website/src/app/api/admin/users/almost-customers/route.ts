import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'

export const GET = requireAdminRouteAuth(getHandler)

async function getHandler(req: Request) {
  const nextReq = req as NextRequest
  const searchParams = nextReq.nextUrl.searchParams
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const filterOutAdmins = searchParams.get('filterOutAdmins') === 'true'

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing date range' }, { status: 400 })
  }

  const fromDate = new Date(from)
  const toDate = new Date(to)

  const baseQuery = Prisma.sql`
    SELECT
      u.id AS "userId",
      u.email,
      -- Note: plan field was removed from User model
      -- u.plan,
      u."createdAt"
    FROM "User" u
    WHERE u."createdAt" BETWEEN ${fromDate} AND ${toDate}
      -- Note: plan and stripeCustomerId fields were removed from User model
      -- AND u.plan = 'free'
      -- AND u."stripeCustomerId" IS NOT NULL
  `

  const adminFilterQuery = filterOutAdmins
    ? Prisma.sql`AND u.id NOT IN (SELECT "userId" FROM "AdminUser")`
    : Prisma.sql``

  const orderQuery = Prisma.sql`
    ORDER BY u."createdAt" DESC
    LIMIT 10
  `

  const fullQuery = Prisma.sql`
    ${baseQuery}
    ${adminFilterQuery}
    ${orderQuery}
  `

  const almostCustomers: {
    userId: string
    email: string
    createdAt: Date
    plan: string
  }[] = await prisma.$queryRaw(fullQuery)

  const formattedAlmostCustomers = almostCustomers.map((customer) => ({
    userId: customer.userId,
    email: customer.email,
    createdAt: customer.createdAt.toISOString(),
    plan: customer.plan,
  }))

  return NextResponse.json(formattedAlmostCustomers)
}
