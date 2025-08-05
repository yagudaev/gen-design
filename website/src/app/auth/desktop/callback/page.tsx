import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import ErrorPage from './ErrorPage'
import SuccessPage from './SuccessPage'


// Server component to handle the OAuth callback
export default async function DesktopAuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise
  const params = await searchParams

  // Check for OAuth errors
  if (params.error) {
    return <ErrorPage error={params.error as string} />
  }

  // Get the current session server-side
  const session = await auth()

  if (!session?.user) {
    // If no session, redirect back to desktop auth to try again
    redirect('/auth/desktop')
    return
  }

  // Create a proper JWT token using the same logic as the mobile app
  let jwtToken: string

  try {
    // Find the user in the database to get the full user object
    const { prisma } = await import('@/lib/db')
    const { toJWTAuthUser } = await import('@/lib/jwtUser')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { adminUser: true },
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    const authUser = await toJWTAuthUser(user)
    jwtToken = authUser.accessToken
  } catch (error) {
    console.error('Failed to create JWT for desktop auth:', error)
    return <ErrorPage error="Failed to create authentication token" />
  }

  return <SuccessPage token={jwtToken} />
}
