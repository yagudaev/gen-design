import { AdminUser, User as DBUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import { toJWTAuthUser } from '@/lib/jwtUser'
import { requireAdminRouteAuth, requireRouteAuth } from '@/lib/requireRouteAuth'
import { SerializedUser } from '@/types'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

// note: any user can call this to stop impersonating them (not a big deal, but worth noting)
export const POST = requireRouteAuth(postHandler)

async function postHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
  options: any,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { impersonatedBy: true },
  })

  for (const impersonator of user?.impersonatedBy || []) {
    await prisma.user.update({
      where: { id: impersonator.id },
      data: { impersonatingUserId: null },
    })
  }

  return Response.json({
    status: 'OK',
  })
}
