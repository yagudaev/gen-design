'use client'

import { toProperCase } from '@workspace/shared/utils'
import { Loader2, LucideInfinity } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'react-hot-toast'
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { callApi } from '@/lib/callApi'

export interface TimeSeriesData {
  date: string
  count: number
}

export function TimelineGraphCard({
  resource,
  label,
  dateRange,
  timeUnit,
  filterOutAdmins,
  userPlan,
}: {
  resource: string
  label: string
  dateRange: DateRange | undefined
  timeUnit: string
  filterOutAdmins: boolean
  userPlan: string
}) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<TimeSeriesData[]>([])
  const [prevStats, setPrevStats] = useState<TimeSeriesData[]>([])
  const total = stats.reduce((acc, { count }) => acc + count, 0)
  const prevTotal = prevStats.reduce((acc, { count }) => acc + count, 0)
  let percentageChange = ((total - prevTotal) / prevTotal) * 100
  if (isNaN(percentageChange)) {
    percentageChange = Infinity
  }

  useEffect(() => {
    fetchStats()
  }, [dateRange, timeUnit, filterOutAdmins, userPlan])

  async function fetchStats() {
    if (!dateRange || !dateRange.from || !dateRange.to) return

    setLoading(true)

    try {
      const { data, prevData } = await callApi<{
        data: { date: string; count: number }[]
        prevData: { date: string; count: number }[]
      }>(
        `/api/admin/${resource}/stats?from=${dateRange.from.toString()}&to=${dateRange.to.toString()}&timeUnit=${timeUnit}&filterOutAdmins=${filterOutAdmins}&userPlan=${userPlan}`,
      )
      setStats(data)
      setPrevStats(prevData || [])
    } catch (error) {
      console.error(`Failed to fetch ${resource}`, error)
      toast.error(`Failed to fetch ${resource}`)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-[500px] h-[300px]">
        <Loader2 className="mr-2 animate-spin" />
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col w-min">
      <div className="flex flex-col items-start mb-8">
        <div className="flex space-x-2">
          <h2 className="mb-2 w-full text-xl">{label}</h2>
          <Badge
            variant={percentageChange >= 0 ? 'default' : 'destructive'}
            className="mb-2"
          >
            {percentageChange >= 0 ? '+' : ''}
            {percentageChange === Infinity ? (
              <LucideInfinity size={18} />
            ) : (
              Math.round(percentageChange * 10) / 10
            )}
            %
          </Badge>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl">{total}</span>
          <span className="ml-2 text-lg text-slate-400">
            {prevTotal} previous period
          </span>
        </div>
      </div>

      <LineChart
        width={500}
        height={300}
        data={stats.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          name={toProperCase(resource)}
          stroke="#8884d8"
          activeDot={{
            r: 8,
          }}
        />
      </LineChart>
    </div>
  )
}
