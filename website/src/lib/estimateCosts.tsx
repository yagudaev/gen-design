import { formatCurrency, formatDuration } from '@workspace/shared/utils'

// costs in cents
const COST_PER_MILLION_CHARACTERS = 15_00
export function estimateCosts(length: number) {
  return formatCurrency(estimateCostInCents(length))
}
function estimateCostInCents(length: number) {
  return (length / 1000000) * COST_PER_MILLION_CHARACTERS
}

const CHARACTERS_PER_SECOND = 15

export function estimateDuration(length: number) {
  return formatDuration(estimateDurationInSeconds(length))
}

export function estimateDurationInSeconds(length: number) {
  return length / CHARACTERS_PER_SECOND
}
