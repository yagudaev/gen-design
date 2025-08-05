'use client'

import { Popover } from '@headlessui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Popover.Button
      as={Link}
      href={href}
      onClick={onClick}
      className={`block p-2 w-full ${isActive ? 'font-bold' : ''}`}
    >
      {children}
    </Popover.Button>
  )
}
