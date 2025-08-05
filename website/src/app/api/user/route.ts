import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireRouteAuth } from '@/lib/requireRouteAuth'
import { serializeUser } from '@/serializers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const GET = requireRouteAuth(getHandler)
export const PATCH = requireRouteAuth(patchHandler)

async function getHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminUser: true,
    },
  })

  const serializedUser = await serializeUser(user)

  return Response.json({
    status: 'OK',
    user: serializedUser,
  })
}

async function patchHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
) {
  const data = await request.json()
  const allowedKeys = [
    'firstName',
    'lastName',
    'referralSource',
    'openaiApiKey',
    'voice',
    'aiContext',
    'conversionService',
    'enableFallbackService',
  ]
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminUser: true,
    },
  })
  if (!user) {
    return Response.json(
      { status: 'error', message: 'User not found' },
      { status: 401 },
    )
  }

  if (user.adminUser) {
    allowedKeys.push('debug')
  }

  const allowedData = Object.keys(data).reduce(
    (acc, key) => {
      if (allowedKeys.includes(key)) {
        acc[key] = data[key]
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedData,
    include: {
      adminUser: true,
    },
  })

  const serializedUser = await serializeUser(updatedUser)

  return Response.json({
    status: 'OK',
    user: serializedUser,
  })
}
