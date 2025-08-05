'use client'

import config from '@/config'
import { useUser } from '@/lib/useUser'

import { NavLink } from '../NavLink'

export function UserNavLink() {
  const user = useUser()

  return (
    <NavLink
      className="px-6 py-6"
      href={user ? '/dashboard' : '/register'}
      variant="default"
    >
      {user ? 'Go to Dashboard' : 'Get Started Today'}
    </NavLink>
  )
}
