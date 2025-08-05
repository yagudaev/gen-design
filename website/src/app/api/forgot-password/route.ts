import sha1 from 'sha1'

import { prisma } from '@/lib/db'

import { sendEmail } from '../../../lib/email'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()

  const user = await prisma.user.findUnique({ where: { email: body.email } })
  if (user) {
    const token = sha1(Math.random().toString(36).substring(7))
    const resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiresAt },
    })
    await sendEmail({
      to: body.email,
      subject: 'Reset your password - Vibeflow',
      html: `<p>Click <a href="${process.env.BASE_URL}/reset-password?token=${token}">here</a> to reset your password</p>`,
    })
    console.log('Sent email to user to reset password', body.email)
  } else {
    console.error('User not found, no need to send an email', body.email)
  }

  return Response.json({
    status: 'OK',
  })
}
