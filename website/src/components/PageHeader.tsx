import { ChevronLeft } from 'lucide-react'
import React from 'react'

import { Breadcrumbs } from './Breadcrumbs'
import { Button } from './ui/button'

export default function PageHeader({
  title,
  breadcrumbs = [{ label: 'Home', href: '/' }],
  children,
}: {
  title: string
  children?: React.ReactNode
  breadcrumbs?: { label: string; href: string }[]
}) {
  const backLink = breadcrumbs[breadcrumbs.length - 1].href

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          href={backLink}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Back</span>
        </Button>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-5xl">{title}</h1>
        <div className="flex justify-between mt-8 md:mt-0">
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
