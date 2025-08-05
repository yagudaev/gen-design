import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'

import { getTimeSeriesHandler, TimeUnit } from '../../getTimeSeriesHandler'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

const query = async (
  startDate: Date,
  endDate: Date,
  timeUnit: TimeUnit,
  filterOutAdmins: boolean,
  userPlan: string,
) => {
  let whereClause = Prisma.sql`"createdAt" >= ${startDate} AND "createdAt" <= ${endDate}`

  if (userPlan !== 'all') {
    whereClause = Prisma.sql`${whereClause} AND "plan" = ${userPlan}`
  }

  if (userPlan === 'pro') {
    whereClause = Prisma.sql`${whereClause} AND "stripeCustomerId" IS NOT NULL`
  }

  const sparseData: { date: Date; count: bigint }[] = await prisma.$queryRaw`
    SELECT DATE_TRUNC('${Prisma.raw(timeUnit)}', "createdAt") as date, COUNT(*) as count
    FROM "User"
    WHERE ${whereClause}
    GROUP BY DATE_TRUNC('${Prisma.raw(timeUnit)}', "createdAt")
    ORDER BY DATE_TRUNC('${Prisma.raw(timeUnit)}', "createdAt") DESC
  `
  return sparseData
}

export const GET = requireAdminRouteAuth(getTimeSeriesHandler(query))
