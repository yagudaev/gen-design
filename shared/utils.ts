import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getValueOrDefault(
  input: string | null | undefined,
  defaultValue: string,
): string {
  // Check if `input` is neither `null` nor `undefined`, and not an empty or whitespace-only string
  if (input !== null && input !== undefined && input.trim() !== '') {
    return input
  } else {
    return defaultValue
  }
}

export function toProperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatCurrency(cents: number, accuracy = 2) {
  return (Math.ceil(cents) / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: accuracy,
  })
}

// truncate text in the middle like mac-os does e.g. `long desc...goes here`
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text

  const separator = '...'
  const separatorLength = separator.length
  const charsToShow = maxLength - separatorLength
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return (
    text.slice(0, frontChars) + separator + text.slice(text.length - backChars)
  )
}

export function formatDateShort(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDuration(durationInSeconds: number) {
  let remaining = Math.round(durationInSeconds)

  const hours = Math.floor(remaining / 3600)
  remaining %= 3600

  const minutes = Math.floor(remaining / 60)
  remaining %= 60

  const seconds = remaining

  let result = ''
  if (hours > 0) result += `${hours}hr `
  if (minutes > 0) result += `${minutes}m `
  if (seconds > 0 && hours === 0 && minutes === 0) result += `${seconds}s`
  if (result === '') result = '0s'

  return result.trim()
}

export function formatDurationPodcast(durationInSeconds: number) {
  let remaining = Math.round(durationInSeconds)

  const hours = Math.floor(remaining / 3600)
  remaining %= 3600

  const minutes = Math.floor(remaining / 60)
  remaining %= 60

  const seconds = remaining

  let result = ''
  if (hours > 0) result += `${hours}:`
  result += `${padZeros(minutes)}:${padZeros(seconds)}`

  return result
}

export function formatDurationFullWords(durationInSeconds: number) {
  let remaining = Math.round(durationInSeconds)

  const hours = Math.floor(remaining / 3600)
  remaining %= 3600

  const minutes = Math.floor(remaining / 60)
  remaining %= 60

  const seconds = remaining

  let result = ''
  if (hours > 0) result += `${hours} hours `
  if (minutes > 0) result += `${minutes} minutes `
  if (seconds > 0 && hours === 0 && minutes === 0)
    result += `${seconds} seconds`
  if (result === '') result = '0 seconds'

  return result.trim()
}

function padZeros(num: number) {
  return num.toString().padStart(2, '0')
}

export const FOREVER = Number.MAX_SAFE_INTEGER

export function insertAt<T = any>(array: Array<T>, index: number, value: T) {
  return [...array.slice(0, index), value, ...array.slice(index)]
}

export function deleteAt<T = any>(array: Array<T>, index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
export function resolveUrl(
  relativeUrl: string | null | undefined,
  currentUrl: string,
) {
  if (!relativeUrl) return undefined

  const urlObject = new URL(currentUrl)
  const resolvedUrl = new URL(relativeUrl, urlObject)
  return resolvedUrl.toString()
}

export async function asyncReduce<T, U>(
  array: T[],
  reducer: (accumulator: U, item: T, index: number, array: T[]) => Promise<U>,
  initialValue: U,
): Promise<U> {
  let accumulator: U = initialValue

  for (let i = 0; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i], i, array)
  }

  return accumulator
}

export function titleize(str: string) {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(),
  )
}
