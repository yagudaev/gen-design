import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

import { prisma } from '@/lib/db'
import { toJWTAuthUser } from '@/lib/jwtUser'
import { addToNewsletter } from '@/newsletter'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const req = await request.json()
  const { token } = req

  try {
    console.log('token', token, 'going to decode it next')

    // Decode without verification first to get the key ID
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || !decoded.header.kid) {
      throw new Error('Invalid token format')
    }

    // Get the matching public key from Apple
    const publicKey = await getApplePublicKey(decoded.header.kid)
    console.log('publicKey', publicKey, 'token', token, 'decoded', decoded)

    // Verify the token
    const verified = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: 'com.audiowaveai.ios', // your app bundle ID
    })

    if (!verified) {
      throw new Error('Invalid token')
    }

    const profile = verified as {
      email: string
      email_verified: boolean
      is_private_email: boolean
      name: {
        firstName: string
        lastName: string
      }
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
          name: `${profile.name.firstName || ''} ${profile.name.lastName || ''}`.trim() || profile.email,
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
    return Response.json({
      status: 'error',
      message: 'Invalid token',
    })
  }
}

async function getApplePublicKey(kid: string) {
  const response = await fetch('https://appleid.apple.com/auth/keys')
  const { keys } = await response.json()
  const key = keys.find((key: any) => key.kid === kid)
  // Convert JWK to PEM format
  return jwkToPem(key)
}

// In your route handler:
