import { User as DBUser } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest } from 'next/server'
import { User as AuthUser } from 'next-auth'

import { cloneDate, DateAgo, DateIn, toDateOnlyString } from '../../../lib/date'

export function getTimeSeriesHandler(
  query: (
    startDate: Date,
    endDate: Date,
    timeUnit: TimeUnit,
    filterOutAdmins: boolean,
    userPlan: string,
  ) => Promise<any[]>,
) {
  return async function getHandler(
    request: Request,
    authUser: AuthUser,
    userId: number,
    options: any,
    dbUser: DBUser,
  ) {
    try {
      const searchParams = (request as NextRequest).nextUrl.searchParams
      const from = searchParams.get('from')
      const to = searchParams.get('to')
      const timeUnit = searchParams.get('timeUnit') || 'daily'
      const filterOutAdmins = searchParams.get('filterOutAdmins') === 'true'
      const userPlan = searchParams.get('userPlan') || 'all'

      const fromDate = from ? new Date(from) : DateAgo.days(30)
      const toDate = to ? new Date(to) : DateIn.days(1)

      console.log('getTimeSeriesHandler', from, to)

      const data = await getTimeSeriesData({
        startDate: fromDate,
        endDate: toDate,
        query,
        timeUnit: normalizeTimeUnit(timeUnit),
        filterOutAdmins,
        userPlan,
      })

      const days = Math.floor(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      console.log('Current period is', {
        fromDate,
        toDate,
      })
      console.log('Previous period is', {
        fromDate: DateAgo.from(fromDate).days(days),
        toDate: fromDate,
      })

      const prevData = await getTimeSeriesData({
        startDate: DateAgo.from(fromDate).days(days),
        endDate: fromDate,
        query,
        timeUnit: normalizeTimeUnit(timeUnit),
        filterOutAdmins,
        userPlan,
      })

      return Response.json({
        status: 'OK',
        data,
        prevData,
      })
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: 'Failed to fetch user stats' },
        { status: 500 },
      )
    }
  }
}

export type TimeUnit = 'day' | 'week' | 'month' | 'year'

async function getTimeSeriesData({
  startDate,
  endDate,
  query,
  timeUnit,
  filterOutAdmins,
  userPlan,
}: {
  startDate: Date
  endDate?: Date
  timeUnit: TimeUnit
  filterOutAdmins: boolean
  userPlan: string
  query: (
    startDate: Date,
    endDate: Date,
    timeUnit: TimeUnit,
    filterOutAdmins: boolean,
    userPlan: string,
  ) => Promise<{ date: Date; count: bigint }[]>
}) {
  endDate = endDate || DateIn.days(1)

  const unitsInRange = getUnitsInRange(endDate, startDate, timeUnit)
  const sparseData = await query(
    startDate,
    endDate,
    timeUnit,
    filterOutAdmins,
    userPlan,
  )

  // fill in missing dates
  const map = new Map(
    sparseData.map((item) => [toDateOnlyString(item.date), Number(item.count)]),
  )

  const fullData = Array.from({ length: unitsInRange }, (_, i) => {
    // subtract i units from the end date
    const date = subtractUnitsFromDate(timeUnit, endDate, i)
    const dateString = toDateOnlyString(date)

    return {
      date: dateString,
      count: map.get(dateString) || 0,
    }
  })

  return fullData
}

function subtractUnitsFromDate(timeUnit: string, date: Date, value: number) {
  let newDate = cloneDate(date)

  if (timeUnit === 'day') {
    newDate.setDate(date.getDate() - value)
  } else if (timeUnit === 'week') {
    newDate = dayjs(getMonday(date)).subtract(value, 'week').toDate()
  } else if (timeUnit === 'month') {
    newDate = dayjs(getFirstDayOfMonth(date)).subtract(value, 'month').toDate()
  } else if (timeUnit === 'year') {
    newDate = dayjs(getStartOfYear(date)).subtract(value, 'year').toDate()
  }

  return newDate
}

function getUnitsInRange(endDate: Date, startDate: Date, timeUnit: TimeUnit) {
  if (timeUnit === 'day') {
    return getDaysInRange(endDate, startDate)
  }
  if (timeUnit === 'week') {
    return getWeeksInRange(endDate, startDate)
  }
  if (timeUnit === 'month') {
    return getMonthsInRange(endDate, startDate)
  }
  if (timeUnit === 'year') {
    return getYearsInRange(endDate, startDate)
  }

  return getDaysInRange(endDate, startDate)
}

function getDaysInRange(endDate: Date, startDate: Date) {
  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )
}

function getWeeksInRange(endDate: Date, startDate: Date) {
  const days = getDaysInRange(endDate, startDate)
  return Math.floor(days / 7)
}

function getMonthsInRange(endDate: Date, startDate: Date) {
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12
  return months + endDate.getMonth() - startDate.getMonth()
}

function getYearsInRange(endDate: Date, startDate: Date) {
  return endDate.getFullYear() - startDate.getFullYear()
}

function normalizeTimeUnit(timeUnit: string): TimeUnit {
  if (timeUnit === 'daily') return 'day'
  if (timeUnit === 'weekly') return 'week'
  if (timeUnit === 'monthly') return 'month'
  if (timeUnit === 'yearly') return 'year'
  return 'day'
}

function getMonday(date: Date): Date {
  let monday = dayjs(date).startOf('week')
  if (monday.day() === 0) {
    monday = monday.add(1, 'day')
  }
  return monday.toDate()
}

function getFirstDayOfMonth(date: Date): Date {
  return dayjs(date).startOf('month').toDate()
}

function getStartOfYear(date: Date): Date {
  return dayjs(date).startOf('year').toDate()
}
