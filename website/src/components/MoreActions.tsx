import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemProps,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@workspace/shared/components/ui/dropdown-menu'
import { LucideEllipsisVertical } from 'lucide-react'
import React, { ReactElement } from 'react'

import { Button, ButtonProps } from '@/components/ui/button'


interface MoreActionsProps {
  children: React.ReactNode
  className?: string
  variant?: ButtonProps['variant']
}

function MoreActions({
  children,
  className,
  variant = 'outline',
  ...props
}: MoreActionsProps & ButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props} variant={variant} className={className}>
          <LucideEllipsisVertical className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

interface MoreActionsItemProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  icon: ReactElement
}

function MoreActionsItem({
  children,
  onClick,
  className,
  icon,
  ...props
}: MoreActionsItemProps & DropdownMenuItemProps) {
  return (
    <DropdownMenuItem {...props} onClick={onClick} className={className}>
      <Icon>{icon}</Icon>
      <Label>{children}</Label>
    </DropdownMenuItem>
  )
}

interface IconProps {
  children: ReactElement
}

function Icon({ children }: IconProps) {
  return React.cloneElement(children, {
    className: 'w-4 h-4 mr-4',
  } as any)
}

interface LabelProps {
  children: React.ReactNode
}

function Label({ children }: LabelProps) {
  return <span>{children}</span>
}

const MoreActionsItemSeparator = DropdownMenuSeparator

export { MoreActions, MoreActionsItem, MoreActionsItemSeparator }
