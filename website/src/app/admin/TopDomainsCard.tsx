'use client'


import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'react-hot-toast'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { callApi } from '@/lib/callApi'

interface DomainStats {
  domain: string
  count: number
}

export function TopDomainsCard({
  dateRange,
  filterOutAdmins,
  userPlan,
}: {
  dateRange: DateRange | undefined
  filterOutAdmins: boolean
  userPlan: string
}) {
  const [loading, setLoading] = useState(true)
  const [domains, setDomains] = useState<DomainStats[]>([])

  useEffect(() => {
    async function fetchDomainStats() {
      if (!dateRange || !dateRange.from || !dateRange.to) return

      setLoading(true)
      try {
        const data = await callApi<DomainStats[]>(
          `/api/admin/chapters/domains?from=${dateRange.from.toString()}&to=${dateRange.to.toString()}&filterOutAdmins=${filterOutAdmins}&userPlan=${userPlan}`,
        )
        setDomains(data)
      } catch (error) {
        console.error('Failed to fetch domain stats', error)
        toast.error('Failed to fetch domain stats')
      } finally {
        setLoading(false)
      }
    }

    fetchDomainStats()
  }, [dateRange, filterOutAdmins, userPlan])

  if (loading) {
    return (
      <div className="flex justify-center items-center w-[500px] h-[300px]">
        <Loader2 className="mr-2 animate-spin" />
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col w-[500px]">
      <h2 className="mb-2 w-full text-xl">Top 10 Domains</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.domain}>
              <TableCell>{domain.domain}</TableCell>
              <TableCell>{domain.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
