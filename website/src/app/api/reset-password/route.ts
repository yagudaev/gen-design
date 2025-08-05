import sha1 from 'sha1'

import { createSalt, hashPassword } from '@/lib/crypto'
import { prisma } from '@/lib/db'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const password = body.password
  const token = body.token

  const user = await prisma.user.findUnique({ where: { resetToken: token } })
  if (
    user &&
    user.resetTokenExpiresAt &&
    user.resetTokenExpiresAt > new Date() &&
    password
  ) {
    const newUser = await resetPassword(user.id, password)
    console.log('Reset the user password', token)
  } else {
    console.error('User not found, no action taken', token)
  }

  return Response.json({
    status: 'OK',
  })
}

async function resetPassword(userId: number, password: string) {
  const salt = createSalt()
  const passwordHash = hashPassword(password, salt)
  const newUser = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, passwordSalt: salt },
  })

  return newUser
}
