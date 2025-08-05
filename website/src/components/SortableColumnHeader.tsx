'use client'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function SortableColumnHeader<T>({
  column,
  children,
  className,
}: {
  column: Column<T>
  children: React.ReactNode
  className?: string
}) {
  const sorting = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorting === 'asc')}
      className={className}
    >
      {children as any}
      {sorting === 'asc' ? (
        <ArrowUp className="ml-2 w-4 h-4" />
      ) : sorting === 'desc' ? (
        <ArrowDown className="ml-2 w-4 h-4" />
      ) : null}
    </Button>
  )
}
