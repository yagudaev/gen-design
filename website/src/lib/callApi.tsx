import { sleep } from '@workspace/shared/utils'
import { notFound } from 'next/navigation'

export class ApiError extends Error {
  errorCode: string

  constructor(message: string, errorCode: string) {
    super(message)
    this.errorCode = errorCode
  }
}

const retryDelays = [15_000, 30_000, 60_000, 90_000]
const MAX_RETRIES = 4

export async function callApi<Data = any>(
  apiPath: string,
  options?: RequestInit & {
    retry?: boolean
    remainingRetries?: number
    noRetryOn?: string[]
  },
) {
  const response = await fetch(apiPath, options)
  const remainingRetries = options?.remainingRetries ?? MAX_RETRIES
  const noRetryOn = options?.noRetryOn ?? []

  if (!response.ok) {
    console.warn('Failed API call', apiPath, response)

    let errorData = { errorCode: 'unknown' }
    try {
      errorData = await response.json()
    } catch (e) {
      console.warn('Failed to parse error data from API response', e)
    }

    const retryable =
      options?.retry &&
      remainingRetries > 0 &&
      !noRetryOn.includes(errorData.errorCode)
    if (retryable) {
      const retryIndex = MAX_RETRIES - remainingRetries
      console.info(
        `Retry #${retryIndex + 1} for ${apiPath} in ${retryDelays[retryIndex]}ms`,
      )
      await sleep(retryDelays[retryIndex])
      return callApi(apiPath, {
        ...options,
        remainingRetries: remainingRetries - 1,
        retry: true,
      })
    }

    if (response.status === 404) {
      return notFound()
    } else {
      throw new ApiError(
        `Server error! Path: ${apiPath}, Status Code: ${response.status}`,
        errorData.errorCode,
      )
    }
  }

  const data = await response.json()
  return data as Data
}
