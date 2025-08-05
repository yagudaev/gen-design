'use client'

import Logo from '@workspace/shared/Logo'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { TextField } from '@/components/Fields'
import { SlimLayout } from '@/components/SlimLayout'
import { Button } from '@/components/ui/button'
import { useTitle } from '@/lib/hooks'

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  )
}

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useTitle('Reset Password - Vibeflow')
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const router = useRouter()

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="w-auto h-10" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Forgot Password
      </h2>
      <Button variant={'link'} color="slate" className="p-0 mt-4">
        <Link href="/login" className="font-medium hover:underline">
          Back to login
        </Link>
      </Button>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const password = formData.get('password') as string
          const confirmPassword = formData.get('confirmPassword') as string

          if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
          }

          setIsLoading(true)
          const res = await fetch('/api/reset-password', {
            method: 'POST',
            body: JSON.stringify({
              password,
              token,
            }),
          })

          if (!res?.ok) {
            toast.error('Server error. Please try again.')
            console.log('res', res)
            setIsLoading(false)
            return
          }

          toast.success(
            'Password reset successfully. You can now log in with your new password.',
          )
          setIsLoading(false)
          router.push('/login')
        }}
        className="grid grid-cols-1 gap-y-8 mt-10"
      >
        <TextField
          label="New Password"
          name="password"
          type="password"
          required
        />
        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
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
