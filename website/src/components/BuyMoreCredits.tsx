'use client'

import { cn } from '@workspace/shared/utils'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/useUser'


export function BuyMoreCredits({
  className,
  label = 'Get Started',
}: {
  label?: string
  className?: string
}) {
  const user = useUser()

  const pricingByPlan = {
    free: {
      monthly: 0,
      yearly: 0,
    },
    pro: {
      regular: 15,
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

  const priceId = pricingByPlan.pro.discount.id
  const price = pricingByPlan.pro.regular
  const planName = 'Pro'

  async function handlePlanClick() {
    let href
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
    <Button
      variant={'default'}
      color="white"
      className={cn('', className)}
      aria-label={`Get started with the ${planName} plan for ${price}`}
      onClick={handlePlanClick}
    >
      {label}
    </Button>
  )
}
