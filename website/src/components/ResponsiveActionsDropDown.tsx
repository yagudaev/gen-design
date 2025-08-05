'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/shared/components/ui/dropdown-menu'
import { LucideEllipsisVertical } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

export function ResponsiveActionsDropDown({
  children,
  expanded = false,
}: {
  children: React.ReactNode
  expanded?: boolean
}) {
  if (expanded) {
    return children
  } else {
    return <ActionsDropDown>{children}</ActionsDropDown>
  }
}
function ActionsDropDown({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div ref={containerRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'ghost'}
            className="p-0 justify-self-end hover:bg-transparent "
          >
            <LucideEllipsisVertical key="button" className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        {isMounted && (
          <DropdownMenuContent
            className="z-[10001] w-56 bg-white text-slate-700"
            container={containerRef.current as HTMLDivElement}
          >
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            {React.Children.map(children, (child, index) => {
              return (
                <DropdownMenuItem
                  key={index}
                  className="py-2 hover:border-none hover:bg-slate-100 hover:ring-0 focus-visible:outline-none"
                >
                  {child}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
