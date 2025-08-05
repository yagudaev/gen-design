'use client'

import { cn } from '@workspace/shared/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { MarketingContainer } from '@/components/MarketingContainer'
import { Button } from '@/components/ui/button'
import config from '@/config'
import { useUser } from '@/lib/useUser'
import { SerializedUser } from '@/types'

import { Badge } from './ui/badge'

export function Offering() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="py-20 bg-slate-900 sm:py-32"
    >
      <MarketingContainer className="flex flex-col items-center max-w-xl text-white">
        <div className="md:text-center">
          <h2 className="text-3xl tracking-tight font-display sm:text-4xl">
            Get started for FREE!
          </h2>
          <div className="mt-4 text-lg text-left ">
            <p>
              Give it a try with your first 10 minutes on us. No credit card.
            </p>
            <p className="mt-4">Limited to first 100! So act fast 👇</p>
          </div>
        </div>

        <Button
          className="px-12 py-6 mt-8 font-bold"
          href={config.earlyAccessUrl}
        >
          Get Your First 10 Minutes FREE!
        </Button>
      </MarketingContainer>
    </section>
  )
}

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'h-6 w-6 flex-none fill-current stroke-current',
        className,
      )}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
