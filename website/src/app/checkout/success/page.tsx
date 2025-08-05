'use client'

import confetti from 'canvas-confetti'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { Header } from '@/components/Header'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/useUser'


export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccess />
    </Suspense>
  )
}

function CheckoutSuccess() {
  const user = useUser()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('sessionId')

  return (
    <>
      <Header />

      <main className="flex flex-col justify-center items-center px-12 mx-auto max-w-7xl min-h-96 grow">
        <h1 className="text-5xl">Your Checkout was Successful 🥳😊</h1>

        <GradualConfetti />

        <h2 className="mt-8 text-3xl">Thank you for your purchase!</h2>
        {user ? (
          <Button className="mt-8" href="/projects">
            Let&apos;s get started
          </Button>
        ) : (
          <Button
            className="mt-8"
            href={`/register?stripeSessionId=${sessionId}`}
          >
            Setup an Account
          </Button>
        )}
      </main>

      <MarketingFooter />
    </>
  )
}

function GradualConfetti() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return null
}
