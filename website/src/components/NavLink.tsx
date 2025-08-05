'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Button, ButtonProps, buttonVariants } from './ui/button'

export function NavLink({
  href,
  children,
  onClick,
  className,
  variant = 'ghost',
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: ButtonProps['variant']
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Button
      variant={variant}
      href={href}
      className={cn(
        buttonVariants({ variant: variant }),
        variant === 'ghost' ? 'text-slate-700 hover:bg-slate-100' : '',
        isActive ? 'font-bold' : '',
        className,
      )}
      onClick={onClick}
    >
      {children as any}
    </Button>
  )
}
