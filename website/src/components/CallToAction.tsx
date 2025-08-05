import Image from 'next/image'
import Link from 'next/link'

import { MarketingContainer } from '@/components/MarketingContainer'
import { Button } from '@/components/ui/button'
import backgroundImage from '@/images/background-call-to-action.jpg'


export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="bg-brand-orange relative overflow-hidden py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <MarketingContainer className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            It’s time to take control of your books. Buy our software so you can
            feel like you’re doing something productive.
          </p>
          <Button color="white" className="mt-10" href="/register">
            Get 6 months free
          </Button>
        </div>
      </MarketingContainer>
    </section>
  )
}
