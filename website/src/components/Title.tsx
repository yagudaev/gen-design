'use client'
import React from 'react'

export const Title = React.forwardRef<
  HTMLHeadingElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <h1 ref={ref} className="text-5xl whitespace-normal break-smart">
      {children}
    </h1>
  )
})
Title.displayName = 'Title'
