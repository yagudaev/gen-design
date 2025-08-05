import { AdminUser, User as DBUser } from '@prisma/client'

import { toJWTAuthUser } from '@/lib/jwtUser'
import { SerializedUser } from '@/types'

export async function userToJson(
  user: (DBUser & { adminUser?: AdminUser | null }) | null,
): Promise<SerializedUser | null> {
  if (!user) return null

  const jwtUser = await toJWTAuthUser(user)

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    referralSource: user.referralSource,
    plan: user.plan,
    accessToken: jwtUser.accessToken,
    admin: !!user.adminUser,
    usedCredits: user.usedCredits,
    totalCredits: user.totalCredits,
    voice: user.voice,
    createdAt: serializeDate(user.createdAt),
    updatedAt: serializeDate(user.updatedAt),

    impersonating: !!user.impersonatingUserId,
    aiContext: user.aiContext,
  }
}
function serializeDate(date: Date) {
  return date.toISOString()
}
