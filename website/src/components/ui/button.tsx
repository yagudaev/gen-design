'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonContainerElement = HTMLButtonElement & HTMLAnchorElement

export interface ButtonProps
  extends React.ButtonHTMLAttributes<ButtonContainerElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loadingLabel?: string | React.ReactNode
  loading?: boolean
  loadingProgress?: number | null
  href?: string
  component?: string | typeof Slot | typeof Link
  openInNewTab?: boolean
  prefetch?: boolean
}

const Button = React.forwardRef<ButtonContainerElement, ButtonProps>(
  (
    {
      component = 'button',
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingLabel = null,
      loadingProgress = null,
      href = undefined,
      openInNewTab = false,
      children,
      disabled,
      prefetch,
      onClick,
      ...props
    },
    ref,
  ) => {
    let Comp: string | typeof Slot | typeof Link = component
    if (asChild) Comp = Slot
    else if (href) {
      if (href.startsWith('http')) Comp = 'a'
      else Comp = Link
    }

    let childrenWrapper = children

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        // @ts-ignore
        href={href}
        prefetch={prefetch}
        onClick={(e) => (disabled ? e.preventDefault() : onClick?.(e as any))}
        disabled={disabled}
        target={openInNewTab ? '_blank' : undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            {loadingProgress === null ? (
              loadingLabel === null ? (
                `${childrenWrapper}...`
              ) : (
                loadingLabel
              )
            ) : (
              <span>
                <span>{loadingLabel}</span>
                <span className="ml-2">{Math.round(loadingProgress)}%</span>
              </span>
            )}
          </>
        ) : (
          <>{childrenWrapper}</>
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
