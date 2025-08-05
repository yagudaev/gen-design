import { NextRequest } from 'next/server'
import { User } from 'next-auth'

// import { prisma } from '@/lib/db'
import { requireRouteAuth } from '@/lib/requireRouteAuth'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export const GET = requireRouteAuth(getHandler)

async function getHandler(request: Request, user: User, userId: number) {
  const url = (request as NextRequest).nextUrl
  const query = url.searchParams.get('q') || ''
  // some code to pull projects

  return Response.json({
    status: 'OK',
    projects: [],
  })
}
