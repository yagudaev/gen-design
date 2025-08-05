'use client'

import Logo from '@workspace/shared/Logo'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { TextField } from '@/components/Fields'
import { SlimLayout } from '@/components/SlimLayout'
import { Button } from '@/components/ui/button'
import { useTitle } from '@/lib/hooks'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useTitle('Forgot Password - Vibeflow')

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Forgot Password
      </h2>
      <Button variant={'link'} color="slate" className="mt-4 p-0">
        <Link href="/login" className="font-medium hover:underline">
          Back to login
        </Link>
      </Button>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const email = formData.get('email') as string

          setIsLoading(true)
          const res = await fetch('/api/forgot-password', {
            method: 'POST',
            body: JSON.stringify({
              email,
            }),
          })

          if (!res?.ok) {
            toast.error('Server error. Please try again.')
            console.log('res', res)
          } else if (res.url) {
            toast.success(
              'Check your email, if you have an account you will receive an email with a link to reset your password.',
            )
          } else {
            console.log('res', res)
            toast.error('Unknown error. Please try again.')
          }
          setIsLoading(false)
        }}
        className="mt-10 grid grid-cols-1 gap-y-8"
      >
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <div>
          <Button
            type="submit"
            color="slate"
            className="w-full"
            disabled={isLoading}
          >
            <span>
              {isLoading ? (
                <>Submitting...</>
              ) : (
                <>
                  Submit <span aria-hidden="true">&rarr;</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  )
}
