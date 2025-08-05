'use client'

import { Popover, Transition } from '@headlessui/react'
import Logo from '@workspace/shared/Logo'
import clsx from 'clsx'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Fragment } from 'react'

import { MarketingContainer } from '@/components/MarketingContainer'
import { NavLink } from '@/components/NavLink'
import { Button } from '@/components/ui/button'
import config from '@/config'
import { useUser } from '@/lib/useUser'
import { SerializedUser, User } from '@/types'

import { Badge } from './ui/badge'

export function AdminHeader() {
  const user = useUser()

  return (
    <header className="pt-4 pb-4 bg-primary text-primary-foreground">
      <MarketingContainer className="">
        <nav className="flex relative z-50 justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo className="w-auto h-10" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {user ? (
                <>
                  <NavLink className="text-primary-foreground" href="/admin">
                    Dashboard
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground"
                    href="/admin/users"
                  >
                    Users
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground"
                    href="/admin/transcriptions"
                  >
                    Transcriptions
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground"
                    href="/admin/scripts"
                  >
                    Scripts
                  </NavLink>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Badge className="px-8 mr-4 text-lg" variant={'secondary'}>
              Admin
            </Badge>
          </div>
          <div className="flex gap-x-5 items-center md:gap-x-8">
            <div className="hidden md:block">
              {user ? (
                <div className="flex gap-x-2 items-center">
                  <NavLink
                    href="/settings"
                    className="text-sm text-primary-foreground"
                  >
                    {user.email} ({user.plan})
                  </NavLink>
                  {/* {user.plan !== 'pro' && (
                    <Button href="/upgrade">Upgrade</Button>
                  )} */}
                  <NavLink
                    className="text-primary-foreground"
                    href="#"
                    onClick={() => signOut()}
                  >
                    Logout
                  </NavLink>
                </div>
              ) : (
                <NavLink href="/login">Sign in</NavLink>
              )}
            </div>
            {!user && (
              // <Button color="slate" href="/register">
              //   Get started <span className="hidden ml-1 lg:inline">today</span>
              // </Button>
              <Button color="slate" href={config.earlyAccessUrl}>
                Get Started Today
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              {/* <MobileNavigation user={user} /> */}
              {user && <MobileNavigation user={user} />}
            </div>
          </div>
        </nav>
      </MarketingContainer>
    </header>
  )
}

function MobileNavigation({ user }: { user?: SerializedUser | null }) {
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
            {/* <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink> */}
            {/* <hr className="m-2 border-slate-300/40" /> */}
            {user ? (
              <>
                {/* <MobileNavLink href="/dashboard">Dashboard</MobileNavLink> */}
                {/* {user.plan !== 'pro' && (
                  <>
                    <Button
                      variant="default"
                      href="/upgrade"
                      className="text-lg"
                    >
                      Upgrade
                    </Button>
                    <hr className="m-2 mt-4 border-slate-300/40" />
                  </>
                )} */}
                <MobileNavLink href="/admin/users">Users</MobileNavLink>
                <MobileNavLink href="/admin/transcriptions">
                  Transcriptions
                </MobileNavLink>
                <MobileNavLink href="/admin/scripts">Scripts</MobileNavLink>
                <MobileNavLink href="/settings">
                  {user.email} ({user.plan})
                </MobileNavLink>
                <MobileNavLink href="#" onClick={() => signOut()}>
                  Logout
                </MobileNavLink>
              </>
            ) : // <MobileNavLink href="/login">Sign in</MobileNavLink>
            null}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Popover.Button
      as={Link}
      href={href}
      onClick={onClick}
      className="block p-2 w-full"
    >
      {children}
    </Popover.Button>
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
