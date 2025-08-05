'use client'

import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { signOut } from 'next-auth/react'
import { Fragment } from 'react'

import { SerializedUser } from '@/types'

import { MobileNavLink } from './MobileNavLink'

export function MobileNavigation({ user }: { user?: SerializedUser | null }) {
  return (
    <Popover>
      <Popover.Button
        className="flex relative z-10 justify-center items-center w-8 h-8 ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="flex absolute inset-x-0 top-full flex-col p-4 mt-4 text-lg tracking-tight bg-white rounded-2xl ring-1 shadow-xl origin-top text-slate-900 ring-slate-900/5"
          >
            {user ? (
              <>
                <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                <MobileNavLink href="/recent-activity">
                  Recent Activity
                </MobileNavLink>
                <MobileNavLink href="/voices">Voices</MobileNavLink>
                <MobileNavLink href="/apps">Apps</MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <MobileNavLink href="/history">History</MobileNavLink>
                <MobileNavLink href="/settings">Settings</MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <MobileNavLink href="#" onClick={() => signOut()}>
                  Logout
                </MobileNavLink>
              </>
            ) : null}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}
