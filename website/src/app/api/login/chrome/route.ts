import { prisma } from '@/lib/db'
import { toJWTAuthUser } from '@/lib/jwtUser'
import { addToNewsletter } from '@/newsletter'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const req = await request.json()
  const { token } = req

  if (!token) {
    return Response.json(
      {
        status: 'error',
        message: 'Missing token',
      },
      { status: 400 },
    )
  }

  try {
    // Get user info from Google token
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (!response.ok) {
      const responseText = await response.text()
      const responseStatus = response.status
      console.error('Failed to verify token', {
        token,
        responseText,
        responseStatus,
      })
      throw new Error('Failed to verify token')
    }

    const profile = await response.json()

    if (!profile || !profile.email) {
      return Response.json(
        {
          status: 'error',
          message: 'Missing email',
        },
        { status: 400 },
      )
    }

    // Use same logic as auth.ts
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
      include: { adminUser: true },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || profile.email,
        },
        include: { adminUser: true },
      })

      // run in background
      addToNewsletter(user)
    }

    const authUser = await toJWTAuthUser(user)

    return Response.json({
      status: 'ok',
      user: authUser,
    })
  } catch (error) {
    console.error('Token verification failed:', error)
    return Response.json(
      {
        status: 'error',
        message: 'Invalid token',
      },
      { status: 400 },
    )
  }
}
