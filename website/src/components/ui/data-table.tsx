'use client'

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@workspace/shared/utils'
import { initial } from 'lodash'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  initialSorting = [],
}: DataTableProps<TData, TValue> & {
  className?: string
  initialSorting?: SortingState
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <Table className={cn('', className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    (header.column.columnDef.meta as any)?.className,
                    'first:!pl-0',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : (flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      ) as any)}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    (cell.column.columnDef.meta as any)?.className,
                    'first:!pl-0',
                  )}
                >
                  {
                    flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    ) as any
                  }
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : loading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="w-full h-24 text-center"
            >
              <div className="flex justify-center">
                <div className="flex">
                  <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                  <span>Loading...</span>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
