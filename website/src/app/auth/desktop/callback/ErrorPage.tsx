'use client'

import Logo from '@workspace/shared/Logo'
import Link from 'next/link'

import { SlimLayout } from '@/components/SlimLayout'

export default function ErrorPage({ error }: { error: string }) {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="w-auto h-10" />
        </Link>
      </div>

      <div className="mt-10 text-center md:mt-20">
        <div className="flex justify-center items-center mx-auto w-12 h-12 bg-red-100 rounded-full">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Authentication Failed
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>

        <div className="flex flex-col gap-3 justify-center mt-6 sm:flex-row">
          <Link
            href="/auth/desktop"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700"
          >
            Try Again
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50"
          >
            Use Web App
          </Link>
        </div>
      </div>
    </SlimLayout>
  )
}
