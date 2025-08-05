import { User as DBUser } from '@prisma/client'
import { User } from 'next-auth'

import { auth } from '@/lib/auth'
import { JWTUserInfo } from '@/types'

import { prisma } from './db'
import * as jwt from './jwt'


export interface AuthenticatedRouteOptions {
  params: Record<string, string | string[]>
}

// Next.js 15 route context type
interface RouteContext {
  params: Promise<Record<string, string | string[]>>
}

// Wrapper function to require authentication on API routes
// e.g. use `export const GET = requireRouteAuth(handler)`
export function requireRouteAuth(
  handler: (
    request: Request,
    user: User,
    userId: number,
    options?: AuthenticatedRouteOptions,
  ) => Promise<Response>,
) {
  return async (request: Request, context: RouteContext) => {
    // Convert Next.js 15 context to our AuthenticatedRouteOptions
    // In Next.js 15, params is a Promise that needs to be awaited
    const resolvedParams = await context.params
    const options: AuthenticatedRouteOptions = {
      params: resolvedParams || {},
    }
    const authHeader = request.headers.get('Authorization')
    let user: User | null = null
    let userId: number | null = null

    if (authHeader) {
      const creds = await authUsingHeader(authHeader)
      user = creds.user
      userId = creds.userId
    } else {
      const creds = await authUsingCookies()
      user = creds.user
      userId = creds.userId
    }

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // note: prisma uses `number` for IDs, but we next-auth uses `string`
    return await handler(request, user as User, userId, options)
  }
}

export function requireAdminRouteAuth(
  handler: (
    request: Request,
    user: User,
    userId: number,
    options: AuthenticatedRouteOptions,
    dbUser: DBUser,
  ) => Promise<Response>,
) {
  return requireRouteAuth(async (request, authUser, userId, options) => {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminUser: true,
      },
    })
    if (!dbUser || !dbUser?.adminUser) {
      return Response.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 },
      )
    }

    return await handler(
      request,
      authUser,
      userId,
      options ?? { params: {} },
      dbUser,
    )
  })
}

async function authUsingHeader(authHeader: string) {
  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer') {
    throw new Error('Invalid authorization header')
  }

  // decode the token from JWT
  const payload = await jwt.verify<JWTUserInfo>(
    token,
    process.env.NEXTAUTH_SECRET as string,
  )

  return { user: { ...payload, id: payload.id.toString() }, userId: payload.id }
}

async function authUsingCookies() {
  const session = await auth()
  // session will be null if the user is not authenticated
  if (!session) {
    return { user: null, userId: null }
  }

  const user = session?.user ?? null
  const userIdStr = user?.id
  const userId = Number(userIdStr)

  if (isNaN(userId)) {
    throw new Error(`Invalid user ID ${JSON.stringify(session)}`)
  }

  return { user, userId }
}

function fromDB(dbUser: DBUser): User {
  return {
    id: dbUser.id.toString(),
    name: dbUser.name || '', // Use name field directly since firstName/lastName don't exist
    email: dbUser.email,
  }
}

// Add this new export
export function optionalRouteAuth(
  handler: (
    request: Request,
    user: User | null,
    userId: number | null,
    options?: AuthenticatedRouteOptions,
  ) => Promise<Response>,
) {
  return async (request: Request, options?: AuthenticatedRouteOptions) => {
    const authHeader = request.headers.get('Authorization')
    let user: User | null = null
    let userId: number | null = null

    try {
      if (authHeader) {
        const creds = await authUsingHeader(authHeader)
        user = creds.user
        userId = creds.userId
      } else {
        const creds = await authUsingCookies()
        user = creds.user
        userId = creds.userId
      }
    } catch (e) {
      // Silently continue if auth fails
    }

    return await handler(request, user, userId, options)
  }
}
