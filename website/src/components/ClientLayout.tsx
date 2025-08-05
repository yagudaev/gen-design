'use client'

import * as Sentry from '@sentry/react'
import { Crisp } from 'crisp-sdk-web'
import { CheckIcon, LucideX, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import posthog from 'posthog-js'
import { ReactNode, useEffect, useState } from 'react'
import toast, { Toaster, toast as toastClient } from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'

// import Announcement from './Announcement'

import config from '@/config'
import { callApi } from '@/lib/callApi'
import { UserProvider, useUser } from '@/lib/useUser'

import { Button } from './ui/button'

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  return (
    <>
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color="#027BFF" showSpinner={false} />

      {/* {showAnnouncement && (
        <Announcement onClose={() => setShowAnnouncement(false)} />
      )} */}

      {/* Content inside app/page.js files  */}
      <UserProvider>
        <ShowImpersonatingBanner />
        {children}

        <CrispChat />
        <SentrySetup />
        <PostHogSetup />
      </UserProvider>

      {/* Show Success/Error messages anywhere from the app with toast() */}
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      >
        {(toast) => {
          return (
            <div
              style={toast.style}
              className="flex items-center px-4 py-3 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg"
            >
              <span>
                {toast.type === 'error' ? (
                  <X
                    size={20}
                    strokeWidth={4}
                    className="p-1 text-white bg-red-500 rounded-full"
                  />
                ) : (
                  <CheckIcon
                    size={20}
                    strokeWidth={4}
                    className="p-1 text-white bg-green-500 rounded-full"
                  />
                )}
              </span>
              <span className="ml-2">{toast.message?.toString()}</span>
              <button className="ml-2">
                <LucideX
                  size={20}
                  onClick={() => {
                    toastClient.dismiss(toast.id)
                  }}
                />
              </button>
            </div>
          )
        }}
      </Toaster>

      {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      <Tooltip
        id="tooltip"
        className="z-[60] max-w-sm !opacity-100 shadow-lg"
      />
    </>
  )
}

export default ClientLayout

function CrispChat() {
  const user = useUser()

  useEffect(() => {
    if (config?.crisp?.id) {
      Crisp.configure(config.crisp.id)
      Crisp.setSafeMode(true)
    }
  }, [])

  useEffect(() => {
    if (user && config?.crisp?.id) {
      Crisp.session.setData({
        userId: user.id,
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  return null
}

function SentrySetup() {
  const user = useUser()

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } else {
      Sentry.setUser(null)
    }
  }, [user])

  return null
}

function PostHogSetup() {
  const user = useUser()

  useEffect(() => {
    posthog.init('phc_yA0AksZ8tlETO3RQkhyZnfWxjBiCwJPwFsVwqUUM0bg', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })
    user && posthog.identify(String(user.id), user)
  }, [user])

  return null
}

function ShowImpersonatingBanner() {
  const user = useUser()

  // Impersonation functionality has been removed
  if (false) {
    return (
      <div className="p-2 text-center text-white bg-red-500">
        Impersonating user {user?.email}
        <Button
          className="ml-2"
          onClick={async () => {
            await callApi('/api/admin/users/stop-impersonating', {
              method: 'POST',
            })

            toast.success('Stopped impersonating')

            // move to their own projects page
            window.location.href = '/dashboard'
          }}
        >
          Stop Impersonating
        </Button>
      </div>
    )
  }

  return null
}
