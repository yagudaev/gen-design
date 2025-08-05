'use client'

import { cn, formatNumber } from '@workspace/shared/utils'
import Link from 'next/link'

import { NavLink } from '@/components/NavLink'
import { calculateRequiredCredits } from '@/lib/credits'
import { useUser } from '@/lib/useUser'


import { Button } from './ui/button'

export function CheckIfInsufficientCredits({
  content,
  className,
  convertedContentLength = 0,
  onClick,
}: {
  content: string
  className?: string
  convertedContentLength?: number
  onClick?: () => void
}) {
  const user = useUser()

  if (!user) {
    return null
  }

  const { hasSufficientCredits, neededCredits } = calculateRequiredCredits(
    user,
    content.length,
    convertedContentLength,
  )

  if (hasSufficientCredits) {
    return null
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <div className="p-4 w-full max-w-7xl text-yellow-800 bg-yellow-100 rounded-sm sm:px-6 lg:px-8">
        <span>
          You need{' '}
          <span className="font-bold">{formatNumber(neededCredits)}</span> more
          credits to complete this conversion.
        </span>
        <Button
          variant="link"
          className="!py-0 !my-0 -ml-4 md:-ml-2  text-base underline text-inherit h-[20px]"
          onClick={onClick}
        >
          Purchase more credits
        </Button>
      </div>
    </div>
  )
}
