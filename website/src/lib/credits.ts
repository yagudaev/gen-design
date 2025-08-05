import { SerializedUser } from '@/types'

// Credit functionality has been removed from the User model
export function calculateRequiredCredits(
  user: SerializedUser | null,
  totalContentLength: number,
  convertedContentLength: number,
): {
  hasSufficientCredits: boolean
  neededCredits: number
  remainingCredits: number
} {
  // Always return sufficient credits since credit system is removed
  return {
    hasSufficientCredits: true,
    neededCredits: 0,
    remainingCredits: 0,
  }
}

// Credit functionality has been removed from the User model
export function getRemainingCredits(user: SerializedUser) {
  return 0
}
