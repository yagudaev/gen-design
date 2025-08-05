import { User as DBUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'
import { userToJson } from '@/lib/serializers/admin/userSerializer'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const GET = requireAdminRouteAuth(getHandler)

async function getHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
  options: any,
  dbUser: DBUser,
) {
  const users = await prisma.user.findMany({
    include: { adminUser: true },
  })

  const serializedUsers = await Promise.all(users.map(userToJson))

  return Response.json({
    status: 'OK',
    users: serializedUsers,
  })
}
