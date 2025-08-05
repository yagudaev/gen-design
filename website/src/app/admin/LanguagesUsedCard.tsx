'use client'

import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'react-hot-toast'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { ResponsiveContainer } from 'recharts'

import { callApi } from '@/lib/callApi'
import { cn } from '@/lib/utils'

export function LanguagesUsedCard({
  className,
  dateRange,
  filterOutAdmins,
  userPlan,
  userIds,
}: {
  className?: string
  dateRange: DateRange | undefined
  filterOutAdmins: boolean
  userPlan: string
  userIds?: number[]
}) {
  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<
    { language: string; count: number }[]
  >([])

  useEffect(() => {
    async function fetchLanguageStats() {
      if (!dateRange || !dateRange.from || !dateRange.to) return

      setLoading(true)
      try {
        const data = await callApi<{ language: string; count: number }[]>(
          `/api/admin/chapters/languages?from=${dateRange.from.toString()}&to=${dateRange.to.toString()}&filterOutAdmins=${filterOutAdmins}&userPlan=${userPlan}${
            userIds && userIds.length > 0 ? `&userIds=${userIds.join(',')}` : ''
          }`,
        )
        setLanguages(data)
      } catch (error) {
        console.error('Failed to fetch language stats', error)
        toast.error('Failed to fetch language stats')
      } finally {
        setLoading(false)
      }
    }

    fetchLanguageStats()
  }, [dateRange, filterOutAdmins, userPlan, userIds])

  if (loading) {
    return (
      <div className="flex justify-center items-center w-[500px] h-[300px]">
        <Loader2 className="mr-2 animate-spin" />
        Loading...
      </div>
    )
  }

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#A4DE6C',
    '#D0ED57',
    '#FFC658',
    '#FF7300',
  ]
  const totalCount = languages.reduce((sum, lang) => sum + lang.count, 0)

  return (
    <div className={cn('flex flex-col w-[500px]', className)}>
      <h2 className="mb-2 w-full text-xl">Top 10 Languages Used</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={languages}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={60}
            fill="#8884d8"
            dataKey="count"
            nameKey="language"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {languages.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="16"
            fontWeight="bold"
          >
            {totalCount}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
