'use client'

import Logo from '@workspace/shared/Logo'
import Link from 'next/link'
import { useEffect } from 'react'

import { SlimLayout } from '@/components/SlimLayout'

export default function SuccessPage({ token }: { token: string }) {
  useEffect(() => {
    // Immediate redirect to desktop app
    window.location.href = `vibeflow://oauth/callback?token=${encodeURIComponent(token)}`
  }, [token])

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="w-auto h-10" />
        </Link>
      </div>

      <div className="mt-10 md:mt-20 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          ✅ Authentication Successful!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You can close this page and return to the Vibeflow desktop app.
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-3">
            The desktop app should open automatically. If it doesn&apos;t:
          </p>
          <a
            href={`vibeflow://oauth/callback?token=${encodeURIComponent(token)}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open Desktop App
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble? You can also{' '}
            <Link
              href="/dashboard"
              className="font-medium text-blue-600 hover:underline"
            >
              continue in the web app
            </Link>
          </p>
        </div>
      </div>
    </SlimLayout>
  )
}
