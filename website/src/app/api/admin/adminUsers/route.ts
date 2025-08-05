import { User as DBUser, AdminUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import {
  requireAdminRouteAuth,
  AuthenticatedRouteOptions,
} from '@/lib/requireRouteAuth'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const GET = requireAdminRouteAuth(getHandler)

async function getHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
  options: AuthenticatedRouteOptions,
  dbUser: DBUser,
) {
  const adminUsers = await prisma.adminUser.findMany()

  return Response.json({
    status: 'OK',
    adminUsers,
  })
}
