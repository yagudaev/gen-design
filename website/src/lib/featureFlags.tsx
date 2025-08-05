'use client'
import { SerializedUser } from '@/types'

export function canUseCustomOpenAIToken(user: SerializedUser | null) {
  return user?.createdAt
    ? new Date(user.createdAt) < new Date('2024-05-21') // created before May 24, 2024
    : false
}
