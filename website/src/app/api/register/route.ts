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

  const salt = createSalt()
  const passwordHash = hashPassword(req.password, salt)

  const userData: UserData = {
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    passwordHash: passwordHash,
    passwordSalt: salt,
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
  passwordHash: string
  passwordSalt: string
  referralSource: string
}

async function createUser(
  userData: UserData,
  stripeSessionId: string | undefined,
): Promise<User | null> {
  let user
  if (stripeSessionId) {
    // avoid any funny business by checking the session ID with Stripe
    const stripeSession =
      await stripe.checkout.sessions.retrieve(stripeSessionId)
    const stripeCustomerId = stripeSession.customer as string
    const stripeEmail = stripeSession.customer_details?.email as string

    console.log(
      'Creating user with Stripe session:',
      stripeSessionId,
      stripeCustomerId,
    )

    if (stripeEmail !== userData.email) {
      return null
    }

    user = prisma.user.update({
      where: { stripeCustomerId: stripeCustomerId },
      data: { ...userData, email: undefined },
    })
  } else {
    user = prisma.user.create({ data: userData })
  }

  return user
}
