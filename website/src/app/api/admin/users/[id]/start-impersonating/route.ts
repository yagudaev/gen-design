import { User as DBUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import {
  AuthenticatedRouteOptions,
  requireAdminRouteAuth,
} from '@/lib/requireRouteAuth'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

// note: any user can call this to stop impersonating them (not a big deal, but worth noting)
export const POST = requireAdminRouteAuth(postHandler)

async function postHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
  options: AuthenticatedRouteOptions,
  dbUser: DBUser,
) {
  const { id } = options.params
  if (!id) {
    return Response.json(
      { status: 'error', message: 'Missing id' },
      { status: 400 },
    )
  }

  const loggedInUserId = userId

  const updatedUser = await prisma.user.update({
    where: { id: loggedInUserId },
    data: {
      impersonatingUserId: Number(id),
    },
  })

  return Response.json({
    status: 'OK',
    user: {
      id: updatedUser.id,
      impersonating: !!updatedUser.impersonatingUserId,
    },
  })
}
