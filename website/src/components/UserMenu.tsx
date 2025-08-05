'use client'

import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { History, LogOut, Settings, User } from 'lucide-react'
import md5 from 'md5'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Fragment } from 'react'


import { cn } from '@/lib/utils'
import { SerializedUser } from '@/types'

import { Badge } from './ui/badge'

export function UserMenu({ user }: { user: SerializedUser }) {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?d=mp`

  return (
    <Menu as="div" className="inline-block relative text-left">
      <Menu.Button className="flex gap-x-2 items-center text-sm text-slate-700">
        <span>{user.name?.trim() || user.email}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gravatarUrl}
          alt={user.email}
          className="w-8 h-8 rounded-full"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'flex items-center px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </Link>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <Link
                  href="/history"
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'flex items-center px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  <History className="mr-2 w-4 h-4" />
                  History
                </Link>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/settings"
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'flex items-center px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </Link>
              )}
            </Menu.Item>
            <div className="my-1 border-t border-gray-100" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'flex items-center px-4 py-2 w-full text-sm text-gray-700',
                  )}
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
