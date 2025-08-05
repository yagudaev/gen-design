'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export default function Step1Page() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownloadClick() {
    setIsLoading(true)
    const link = document.createElement('a')
    link.href = '/start/audiowaveai-linkedin-sample.csv'
    link.download = 'audiowaveai-linkedin-sample.csv'
    link.click()

    await sleep(2000)

    setIsLoading(false)
    window.location.href = '/onboarding/step3'
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">
        Let&apos;s install the extension you just downloaded.
      </h1>
      <h2 className="mt-4 text-2xl">
        Let&apos;s try our sample data to see how it works!
      </h2>
      <Button
        className="mt-8"
        onClick={() => {
          window.open(
            '/releases/audiowaveai-chrome-extension-v0.1.0.zip',
            '_blank',
          )
          window.location.href = '/onboarding/step3'
        }}
      >
        <p className="block">Download Version 0.1.0</p>
      </Button>
      <Image
        src="/start/step-1.png"
        width={400}
        height={400}
        alt="Step 1"
        className="mt-8"
      />
    </div>
  )
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
