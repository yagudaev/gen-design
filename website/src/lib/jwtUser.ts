import { User as DBUser } from '@prisma/client'

import * as jwt from '@/lib/jwt'
import { JWTUserInfo } from '@/types'

export async function toJWTAuthUser(user: DBUser) {
  const userInfo: JWTUserInfo = {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }

  const accessToken: string = await jwt.sign(
    userInfo,
    process.env.NEXTAUTH_SECRET as string,
  )

  return { ...userInfo, id: userInfo.id.toString(), accessToken }
}
