import sha1 from 'sha1'

import { prisma } from '@/lib/db'

import { sendEmail } from '../../../lib/email'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()

  // Password reset functionality has been removed since resetToken fields were removed
  console.log('Password reset request ignored - functionality not available', body.email)

  return Response.json({
    status: 'OK',
  })
}
