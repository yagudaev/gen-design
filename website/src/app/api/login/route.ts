import sha1 from 'sha1'

import { prisma } from '@/lib/db'

import { toJWTAuthUser } from '../../../lib/jwtUser'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const req = await request.json()

  const user = await authorize({
    email: req.email,
    password: req.password,
  })

  if (!user) {
    return Response.json({
      status: 'error',
      message: 'Invalid email or password',
    })
  }

  return Response.json({
    status: 'ok',
    user,
  })
}

// Note: duplicate from auth.ts
async function authorize(credentials: {
  email: string
  password: string
}): Promise<AuthUser | null> {
  if (!credentials?.email || !credentials?.password) return null
  if (
    typeof credentials.email !== 'string' ||
    typeof credentials.password !== 'string'
  ) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  })
  if (!user) return null

  const salt = user.passwordSalt ?? ''
  const expectedPasswordHash = user.passwordHash
  const actualPasswordHash = sha1(credentials.password + salt)
  if (expectedPasswordHash === actualPasswordHash) {
    const authUser = await toJWTAuthUser(user)
    return authUser
  }

  return null
}

interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}
