import { User } from '@prisma/client'
import { getSession } from 'next-auth/react'

import { auth, signIn } from '@/lib/auth'
import { createSalt, hashPassword } from '@/lib/crypto'
import { prisma } from '@/lib/db'
import { toJWTAuthUser } from '@/lib/jwtUser'
import stripe from '@/lib/stripe'
import { addToNewsletter } from '@/newsletter'
// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // ⚠️ Email registration is temporarily disabled due to security concerns
  return Response.json(
    {
      error:
        'Email/password registration is temporarily disabled. Please sign up with Google instead.',
      errors: {
        email: 'Email/password registration is temporarily disabled',
        general: 'Please use Google sign-up',
      },
    },
    { status: 403 },
  )

  // The code below is disabled but kept for when email registration is re-enabled
  /*
  const req = await request.json()

  // Password hashing removed since password fields no longer exist
  // const salt = createSalt()
  // const passwordHash = hashPassword(req.password, salt)

  const userData: UserData = {
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    // passwordHash: passwordHash, // Removed - field no longer exists
    // passwordSalt: salt, // Removed - field no longer exists
    referralSource: req.referralSource,
  }

  const stripeSessionId = req.stripeSessionId
  const existingUser = await prisma.user.findUnique({
    where: { email: req.email },
  })
  if (existingUser && !stripeSessionId) {
    return Response.json(
      {
        error: 'An account with that email address already exists',
        errors: { email: 'An account with that email address already exists' },
      },
      { status: 400 },
    )
  }

  const user = await createUser(userData, stripeSessionId)
  if (!user) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // no need to await this, it's async but we can continue
  addToNewsletter(user as User)

  await signIn('credentials', {
    email: req.email,
    password: req.password,
    redirect: false,
  })

  const jwtUser = await toJWTAuthUser(user)
  const accessToken = jwtUser.accessToken

  return Response.json({
    status: 'OK',
    user: { ...user, accessToken },
  })
  */
}

interface UserData {
  firstName: string
  lastName: string
  email: string
  // passwordHash: string // Removed - password fields no longer exist
  // passwordSalt: string // Removed - password fields no longer exist
  referralSource: string
}

// Legacy user creation function - disabled since password authentication removed
async function createUser(
  userData: UserData,
  stripeSessionId: string | undefined,
): Promise<User | null> {
  // This function is disabled since:
  // 1. Password authentication was removed 
  // 2. UserData interface references removed password fields
  // 3. Stripe integration may need to be updated for current User model
  throw new Error('User creation via email/password is disabled. Use Google sign-in instead.')
}
