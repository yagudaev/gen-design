'use client'

import { ArrowRightIcon } from '@heroicons/react/20/solid'
import Logo from '@workspace/shared/Logo'
import { type Metadata } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { TextField } from '@/components/Fields'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { SlimLayout } from '@/components/SlimLayout'
import { Button } from '@/components/ui/button'
import { useTitle } from '@/lib/hooks'

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useTitle('Sign In - Vibeflow')

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="w-auto h-10" />
        </Link>
      </div>
      <h2 className="mt-10 text-lg font-semibold text-gray-900 md:mt-20">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-primary/90 hover:underline"
        >
          Sign up
        </Link>{' '}
        for a free trial.
      </p>

      <GoogleSignInButton />

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const email = formData.get('email') as string
          const password = formData.get('password') as string

          setIsLoading(true)
          const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: `${window.location.origin}`,
          })

          if (!res?.ok) {
            toast.error('Server error. Please try again.')
            console.log('res', res)
          } else if (res.url) {
            toast.success('Signed in successfully')
            // window.location.href = res.url
            window.location.href = '/dashboard'
          } else {
            console.log('res', res)
            if (res.error === 'CredentialsSignin') {
              toast.error('Invalid email or password')
            } else {
              toast.error('Unknown error. Please try again.')
            }
          }
          setIsLoading(false)
        }}
        className="grid grid-cols-1 gap-y-8 mt-10"
      >
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button variant={'link'} className="justify-self-start p-0">
          <Link href="/forgot-password">Forgot password?</Link>
        </Button>
        <div>
          <Button
            type="submit"
            color="slate"
            className="w-full"
            disabled={isLoading}
          >
            <span>
              {isLoading ? (
                <>Signing in...</>
              ) : (
                <>
                  Sign in <span aria-hidden="true">&rarr;</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  )
}
