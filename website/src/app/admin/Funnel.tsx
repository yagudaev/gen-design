'use client'
import {
  ResponsiveContainer,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from 'recharts'

const data = [
  { name: 'Visitors', value: 200 },
  { name: 'Signups', value: 20 },
  { name: 'Customers', value: 20 * 0.05 },
]
export function Funnel() {
  return (
    <ResponsiveContainer height={300}>
      <BarChart data={data}>
        <Tooltip />
        <XAxis dataKey="name" />
        <YAxis />

        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}
