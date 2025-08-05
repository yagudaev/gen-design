'use client'

import Logo from '@workspace/shared/Logo'
import { type Metadata } from 'next'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { SelectField, TextField } from '@/components/Fields'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { SlimLayout } from '@/components/SlimLayout'
import { Button } from '@/components/ui/button'
import { useTitle } from '@/lib/hooks'

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  )
}

function Register() {
  useTitle('Sign Up - Vibeflow')
  const searchParams = useSearchParams()
  const stripeSessionId = searchParams?.get('stripeSessionId')

  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  useEffect(() => {
    stripeSessionId && fetchEmail()
  }, [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function fetchEmail() {
    const res = await fetch(`/api/stripe/checkout/${stripeSessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const { email, name } = await res.json()
    const [first, last] = (name || '').split(' ')
    setEmail(email)
    setFirstName(first)
    setLastName(last)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})
    const form = event.currentTarget
    const emailField = form.elements.namedItem('email') as HTMLInputElement

    // Temporarily enable the email field, since disabled fields return null otherwise
    emailField.disabled = false

    const formData = new FormData(form)

    const payload = {
      firstName: formData.get('first_name') as string,
      lastName: formData.get('last_name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      referralSource: formData.get('referral_source') as string,
      stripeSessionId,
    }

    // Disable the email field again
    emailField.disabled = true

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Welcome! You are now registered.')
        window.location.href = '/dashboard'
      } else {
        toast.error(data.error || 'Failed to register, please try again.')
        setErrors(data.errors || {})
      }
    } catch (error) {
      toast.error('Failed to register, please try again.')
    } finally {
      emailField.disabled = false
    }
  }

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="w-auto h-10" />
        </Link>
      </div>
      <h2 className="mt-10 text-lg font-semibold text-gray-900 md:mt-20">
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>{' '}
        to your account.
      </p>

      <GoogleSignInButton text="Sign up with Google" />

      {/* <div className="relative mt-6">
        <div className="flex absolute inset-0 items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="flex relative justify-center text-sm">
          <span className="px-2 text-gray-500 bg-white">Or continue with</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-x-6 gap-y-8 mt-10 sm:grid-cols-2"
      >
        <TextField
          label="First name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          defaultValue={firstName}
          error={errors.firstName}
          required
        />
        <TextField
          label="Last name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          defaultValue={lastName}
          error={errors.lastName}
          required
        />
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          defaultValue={email}
          error={errors.email}
          disabled={!!stripeSessionId}
          required
        />
        <TextField
          className="col-span-full"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <SelectField
          className="hidden col-span-full"
          label="How did you hear about us?"
          name="referral_source"
        >
          <option>AltaVista search</option>
          <option>Super Bowl commercial</option>
          <option>Our route 34 city bus ad</option>
          <option>The “Never Use This” podcast</option>
        </SelectField>
        <div className="col-span-full">
          <Button type="submit" color="slate" className="w-full">
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form> */}
    </SlimLayout>
  )
}
