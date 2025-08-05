import { User as DBUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import {
  AuthenticatedRouteOptions,
  requireAdminRouteAuth,
} from '@/lib/requireRouteAuth'
import { userToJson } from '@/lib/serializers/admin/userSerializer'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
// note: any user can call this to stop impersonating them (not a big deal, but worth noting)
export const GET = requireAdminRouteAuth(getHandler)
export const PATCH = requireAdminRouteAuth(patchHandler)

async function getHandler(
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

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      adminUser: true,
    },
  })

  if (!user) {
    return Response.json(
      { status: 'error', message: 'User not found' },
      { status: 404 },
    )
  }

  return Response.json({
    status: 'OK',
    user: await userToJson(user),
  })
}

async function patchHandler(
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

  const data = await request.json()
  const allowedKeys = [
    'firstName',
    'lastName',
    'email',
    'referralSource',
    'plan',
    'openaiApiKey',
    'voice',
    'readPublishedDate',
    'readChapterTitle',
    'aiContext',
    'flagProjectSummary',
    'flagStreaming',
    'streaming',
    'conversionService',
    'enableFallbackService',
    'usedCredits',
    'totalCredits',
    'debug',
    'usedCredits',
    'totalCredits',
  ]

  const allowedData = Object.keys(data).reduce(
    (acc, key) => {
      if (allowedKeys.includes(key)) {
        acc[key] = data[key]
      }
      return acc
    },
    {} as Record<string, any>,
  )

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: allowedData,
      include: {
        adminUser: true,
      },
    })

    return Response.json({
      status: 'OK',
      user: await userToJson(updatedUser),
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return Response.json(
      { status: 'error', message: 'Failed to update user' },
      { status: 500 },
    )
  }
}
