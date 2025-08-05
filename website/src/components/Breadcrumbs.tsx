'use client'
import { cn } from '@workspace/shared/utils'
import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function Breadcrumbs({
  items,
  className,
}: {
  items?: { label: string; href: string }[]
  className?: string
}) {
  return (
    <Breadcrumb className={cn('', className)}>
      <BreadcrumbList>
        {items?.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              {index + 1 < items.length && (
                <BreadcrumbSeparator key={`separator-${index}`} />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
