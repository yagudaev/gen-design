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
    email: user.email,
    name: user.name,
    accessToken: jwtUser.accessToken,
    admin: !!user.adminUser,
    createdAt: serializeDate(user.createdAt),
    updatedAt: serializeDate(user.updatedAt),
  }
}
function serializeDate(date: Date) {
  return date.toISOString()
}
