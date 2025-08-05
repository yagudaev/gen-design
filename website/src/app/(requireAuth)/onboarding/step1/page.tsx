'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

type Scope = 'all' | 'productHunters' | 'errors' | 'notFound'

export default function Step1Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">Welcome to {'Vibeflow'} 👋! </h1>
      <h2 className="mt-4 text-2xl">
        Let&apos;s get started by downloading the Chrome Extension 👇
      </h2>
      <Button
        className="mt-8"
        onClick={() => {
          window.open(
            '/releases/audiowaveai-chrome-extension-v0.1.0.zip',
            '_blank',
          )
          window.location.href = '/onboarding/step2'
        }}
      >
        <p className="block">Download Version 0.1.0</p>
      </Button>
    </div>
  )
}
