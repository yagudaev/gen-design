'use client'

import {
  SelectItem,
  SimpleSelect,
} from '@workspace/shared/components/ui/select'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'


import { DatePickerWithRange } from '@/components/DateRangePicker'
import { PageBody } from '@/components/PageBody'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateAgo } from '@/lib/date'
import { useTitle } from '@/lib/hooks'

import { AlmostCustomersCard } from './AlmostCustomersCard'
import { CreditUsageCard } from './CreditUsageCard'
import { Funnel } from './Funnel'
import { TimelineGraphCard } from './TimelineGraphCard'

const ALL_TIME_VALUE = -999

export default function AdminDashboardPage() {
  useTitle('Admin Dashboard')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: DateAgo.days(30),
    to: new Date(),
  })
  const [presetRange, setPresetRange] = useState('30')
  const [timeUnit, setTimeUnit] = useState('daily')
  const daysInPeriod =
    dateRange?.from && dateRange?.to
      ? Math.floor(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0
  const [filterOutAdmins, setFilterOutAdmins] = useState(true)
  const [userPlan, setUserPlan] = useState('all')

  useEffect(() => {
    if ('Custom' === presetRange) return

    const daysAgo = parseInt(presetRange, 10)
    if (isNaN(daysAgo)) return

    const from =
      daysAgo === ALL_TIME_VALUE
        ? new Date('2024-04-15')
        : DateAgo.days(daysAgo)
    const to = new Date()
    setDateRange({ from, to })
  }, [presetRange])

  // change timeUnit as other controls change
  useEffect(() => {
    if (presetRange === '1' || presetRange === '7' || daysInPeriod < 14) {
      setTimeUnit('daily')
    } else if (
      (presetRange === '30' &&
        (timeUnit === 'monthly' || timeUnit === 'yearly')) ||
      daysInPeriod < 60
    ) {
      setTimeUnit('weekly')
    } else if (
      (presetRange === '90' && timeUnit === 'yearly') ||
      daysInPeriod < 365
    ) {
      setTimeUnit('monthly')
    } else if (presetRange === String(ALL_TIME_VALUE)) {
      setTimeUnit('monthly')
    } else {
      setTimeUnit('monthly')
    }
  }, [presetRange, daysInPeriod])

  return (
    <PageBody className="mt-8">
      {/* <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }]} /> */}
      {/* header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-5xl">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filterAdmins"
              checked={filterOutAdmins}
              onCheckedChange={(checked) =>
                setFilterOutAdmins(checked as boolean)
              }
            />
            <label htmlFor="filterAdmins">Filter Admin Usage</label>
          </div>
          <Tabs value={userPlan} onValueChange={setUserPlan}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
            </TabsList>
          </Tabs>
          <SimpleSelect
            onValueChange={(value) => {
              setPresetRange(value)
            }}
            value={presetRange}
            placeholder="Select Time Range"
          >
            <SelectItem value={'1'}>Today</SelectItem>
            <SelectItem value={'7'}>Last 7 days</SelectItem>
            <SelectItem value={'30'}>Last 30 days</SelectItem>
            <SelectItem value={'90'}>Last 90 days</SelectItem>
            <SelectItem value={String(ALL_TIME_VALUE)}>All Time</SelectItem>
            <SelectItem value={'Custom'}>Custom</SelectItem>
          </SimpleSelect>
          <DatePickerWithRange
            value={dateRange}
            onChange={(date) => {
              setDateRange(date as any)
              setPresetRange('Custom')
            }}
          />
          <SimpleSelect
            placeholder="Time Unit"
            value={timeUnit}
            onValueChange={(value) => setTimeUnit(value)}
          >
            <SelectItem value="daily">Daily</SelectItem>
            {daysInPeriod >= 14 && (
              <SelectItem value="weekly">Weekly</SelectItem>
            )}
            {daysInPeriod >= 60 && (
              <SelectItem value="monthly">Monthly</SelectItem>
            )}
            {daysInPeriod >= 365 && (
              <SelectItem value="yearly">Yearly</SelectItem>
            )}
          </SimpleSelect>
        </div>
      </div>
      {/* body */}
      <div className="flex flex-col mt-8 space-y-6">
        {/* Row */}
        <div className="flex flex-col space-x-4 w-min md:flex-row">
          <TimelineGraphCard
            label="New Users"
            resource="users"
            dateRange={dateRange}
            timeUnit={timeUnit}
            filterOutAdmins={filterOutAdmins}
            userPlan={userPlan}
          />
          <TimelineGraphCard
            label="Shared Content"
            resource="chapters/shared"
            dateRange={dateRange}
            timeUnit={timeUnit}
            filterOutAdmins={filterOutAdmins}
            userPlan={userPlan}
          />
        </div>

        <div className="flex flex-col space-x-4 w-full md:flex-row">
          {/* Card */}
          <div className="flex flex-col w-[500px]">
            <h2 className="mb-2 w-full text-xl text-center">
              Conversion Funnel
            </h2>
            <h3 className="text-center">Overall: 0.5% (target: 2%)</h3>
            <Funnel />
          </div>

          {/* TODO: add costs */}
          {/* add number of pro users over time */}
          {/* type of content, url, text or file uploaded */}
          {/* allow segementing between pro and free users */}
          <CreditUsageCard
            filterOutAdmins={filterOutAdmins}
            userPlan={userPlan}
          />
        </div>

        {/* Add this new row for VoicesUsedCard and LanguagesUsedCard */}
        {/* <div className="flex flex-col space-x-4 w-full md:flex-row">
          <VoicesUsedCard
            dateRange={dateRange}
            filterOutAdmins={filterOutAdmins}
            userPlan={userPlan}
          />
        </div> */}

        {/* Add this new row for AlmostCustomersCard */}
        <div className="flex flex-col space-x-4 w-full md:flex-row">
          <AlmostCustomersCard
            dateRange={dateRange}
            filterOutAdmins={filterOutAdmins}
            userPlan={userPlan}
          />
        </div>
      </div>
    </PageBody>
  )
}
