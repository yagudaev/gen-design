'use client'

import { cn } from '@workspace/shared/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { MarketingContainer } from '@/components/MarketingContainer'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/useUser'
import { SerializedUser } from '@/types'

import { Badge } from './ui/badge'

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'flex-none w-6 h-6 fill-current stroke-current',
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

function Plan({
  name,
  price,
  discountPrice,
  discountDetails,
  description,
  href,
  features,
  featured = false,
  priceId,
  user,
  planCTA = 'Get Started',
}: {
  name: string
  price: string
  discountPrice?: string
  discountDetails?: string
  description: string
  href?: string
  features: Array<string>
  featured?: boolean
  priceId?: string
  user?: SerializedUser | null
  planCTA?: string
}) {
  async function handlePlanClick() {
    if (priceId) {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          returnUrl: window.location.href,
        }),
      })

      if (!res.ok) {
        toast.error('Error creating checkout session')
        console.error('Error creating checkout session:', res)
        return
      }

      const { url } = await res.json()
      href = url
    }

    href && (window.location.href = href)
  }

  return (
    <section
      className={clsx(
        'flex flex-col px-6 rounded-3xl sm:px-8',
        featured
          ? 'order-first px-16 py-16 border-2 bg-brand-orange lg:order-none border-primary'
          : 'lg:py-8',
      )}
    >
      {discountPrice && discountDetails && (
        <p className="mt-2 text-sm text-white">{discountDetails}</p>
      )}
      <h3 className="mt-5 text-lg text-white font-display">{name}</h3>
      <p
        className={clsx(
          'mt-2 text-base',
          featured ? 'text-white' : 'text-slate-400',
        )}
      >
        {description}
      </p>

      <p
        className={cn(
          'order-first text-5xl font-light tracking-tight text-white font-display',
        )}
      >
        {discountPrice}
        <span
          className={cn(
            '',
            discountPrice && 'ml-4 text-slate-500 line-through',
          )}
        >
          {price}
        </span>
      </p>

      <ul
        role="list"
        className={clsx(
          'flex flex-col order-last gap-y-3 mt-10 text-sm',
          featured ? 'text-white' : 'text-slate-200',
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? 'text-white' : 'text-slate-400'} />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={featured ? 'default' : 'outline'}
        color="white"
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
        onClick={handlePlanClick}
      >
        {planCTA}
      </Button>
    </section>
  )
}

export function Pricing() {
  const user = useUser()

  const pricingByPlan = {
    free: {
      monthly: 0,
      yearly: 0,
    },
    pro: {
      regular: 20,
      discount: {
        amount: 15,
        id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? '',
      },
    },
    executive: {
      monthly: { regular: 129, discount: 99 },
      yearly: { regular: 99, discount: 66 },
    },
  }

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="py-20 bg-slate-900 sm:py-32"
    >
      <MarketingContainer className="flex flex-col items-center">
        <div className="md:text-center">
          <h2 className="text-3xl tracking-tight text-white font-display sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Pay as you go, start by trying the free plan and load credits as you
            need them
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 -mx-4 mt-4 max-w-lg sm:mx-auto md:mt-16 lg:-mx-8 lg:max-w-4xl lg:grid-cols-2 xl:mx-0 xl:gap-x-8">
          {/* <div className="grid grid-cols-1 gap-y-10 -mx-4 mt-16 max-w-lg sm:mx-auto lg:-mx-8 lg:max-w-7xl lg:grid-cols-3 xl:mx-0 xl:gap-x-8"> */}
          <Plan
            name="Free"
            user={user}
            price="$0"
            description="Good for anyone who is just getting started and wants to test the a few audio conversions."
            href="/register"
            features={[
              '2 Articles',
              'Up to 10 Minutes of audio',
              '10,000 characters',
            ]}
          />
          <Plan
            featured
            user={user}
            name="10 Hours of Audio"
            priceId={pricingByPlan.pro.discount.id}
            price={`$${pricingByPlan.pro.regular}`}
            description="Perfect for learning a new topic, listening to many articles or a book or two."
            features={[
              '100 Articles',
              'Up to 10 Hours of audio',
              '600,000 Characters',
              'Priority support',
              'Early access to new features',
            ]}
            planCTA="Buy Now"
          />
          {/* <Plan
            name="Executive (new)"
            price={`$${pricingByPeriod[selectedPricingPeriod].executive.regular}/mo`}
            discountPrice={`$${pricingByPeriod[selectedPricingPeriod].executive.discount}/mo`}
            discountDetails="Early access pricing 33% off"
            description="Perfect for those who value their time. As they say, time is money."
            href="/register"
            features={[
              'Unlimited words processed a month',
              'Summarization for Reddit, Linkedin, Twitter, and more',
              'Priority support',
              'Early access to new features',
              'Unlimited Audio playback',
            ]}
          /> */}
        </div>
      </MarketingContainer>
    </section>
  )
}
