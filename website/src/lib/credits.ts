import { SerializedUser } from '@/types'

export function calculateRequiredCredits(
  user: SerializedUser | null,
  totalContentLength: number,
  convertedContentLength: number,
): {
  hasSufficientCredits: boolean
  neededCredits: number
  remainingCredits: number
} {
  if (!user) {
    return {
      hasSufficientCredits: false,
      neededCredits: 0,
      remainingCredits: 0,
    }
  }

  const remainingCredits = getRemainingCredits(user)

  const unconvertedLength = totalContentLength - convertedContentLength
  const neededCredits = Math.max(0, unconvertedLength - remainingCredits)

  return {
    hasSufficientCredits: neededCredits === 0,
    neededCredits,
    remainingCredits,
  }
}

export function getRemainingCredits(user: SerializedUser) {
  return Math.max(0, user.totalCredits - user.usedCredits || 0)
}
