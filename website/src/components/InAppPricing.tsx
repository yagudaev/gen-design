'use client'

import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/useUser'
import { SerializedUser } from '@/types'

function Plan({
  name,
  price,
  discountPrice,
  discountDetails,
  description,
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
      window.location.href = url
    }
  }

  return (
    <section
      className={clsx(
        'flex flex-col px-6 py-2 rounded-3xl sm:px-2',
        featured ? 'order-first lg:order-none' : '',
      )}
    >
      {discountPrice && discountDetails && (
        <p className="mt-2 text-sm text-muted-foreground">{discountDetails}</p>
      )}
      <h3 className="mt-5 text-lg font-display">{name}</h3>
      {/* <p className={clsx('mt-2 text-base text-muted-foreground')}>
        {description}
      </p> */}

      <p className="order-first text-5xl font-light tracking-tight font-display">
        {discountPrice}
        <span
          className={clsx(
            '',
            discountPrice &&
              'ml-4 text-muted-foreground line-through text-3xl align-text-top mt-2',
          )}
        >
          {price}
        </span>
        <span className="ml-2 text-base text-muted-foreground">one-time</span>
      </p>

      <ul role="list" className="flex flex-col gap-y-3 mt-4 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <CheckIcon className="w-4 h-4 text-muted-foreground" />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? 'default' : 'outline'}
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
        onClick={handlePlanClick}
      >
        {planCTA}
      </Button>
    </section>
  )
}

export function InAppPricing() {
  const user = useUser()

  const pricingByPlan = {
    pro: {
      regular: 30,
      discount: {
        amount: 15,
        id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? '',
      },
    },
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium text-center">
        Unlock More Processing
      </h2>

      <div className="grid grid-cols-1 gap-8 justify-center mx-auto mt-8 max-w-2xl">
        <Plan
          featured
          user={user}
          name="10 Hours of Audio Processing"
          priceId={pricingByPlan.pro.discount.id}
          price={`$${pricingByPlan.pro.regular}`}
          discountPrice={`$${pricingByPlan.pro.discount.amount}`}
          discountDetails="Limited time early access offer"
          description="Perfect for learning a new topic, listening to many articles or a book or two."
          features={[
            'One-time payment, no subscription',
            'Process up to 10 hours of audio (100 articles, 2 books)',
            '600,000 characters of text',
            'Priority support',
            'Early access to new features',
          ]}
          planCTA="Buy Credits Now"
        />
      </div>
    </div>
  )
}
