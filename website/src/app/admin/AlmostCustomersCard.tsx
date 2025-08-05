import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { callApi } from '@/lib/callApi'

import { PlanBadge } from './PlanBadge'

interface AlmostCustomer {
  userId: string
  email: string
  createdAt: string
  plan: string
}

export function AlmostCustomersCard({
  dateRange,
  filterOutAdmins,
  userPlan,
}: {
  dateRange: DateRange | undefined
  filterOutAdmins: boolean
  userPlan: string
}) {
  const [almostCustomers, setAlmostCustomers] = useState<AlmostCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!dateRange || !dateRange.from || !dateRange.to) return

      setLoading(true)
      try {
        const data = await callApi<AlmostCustomer[]>(
          `/api/admin/users/almost-customers?from=${dateRange.from.toString()}&to=${dateRange.to.toString()}&filterOutAdmins=${filterOutAdmins}&userPlan=${userPlan}`,
        )
        setAlmostCustomers(data)
      } catch (error) {
        console.error('Error fetching almost customers:', error)
      }
      setLoading(false)
    }

    if (dateRange?.from && dateRange?.to) {
      fetchData()
    }
  }, [dateRange, filterOutAdmins])

  return (
    <div className="flex flex-col w-full">
      <h2 className="mb-2 w-full text-xl text-center">Almost Customers</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {almostCustomers.map((customer) => (
              <TableRow key={customer.userId}>
                <TableCell>
                  <Link href={`/admin/users/${customer.userId}`}>
                    {customer.email} <PlanBadge plan={customer.plan} />
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
