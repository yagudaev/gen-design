'use client'

import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { Badge } from '@/components/ui/badge'
import { callApi } from '@/lib/callApi'
import { CreditStats } from '@/types'

// Add this new component
export function CreditUsageCard({
  filterOutAdmins,
  userPlan,
}: {
  filterOutAdmins: boolean
  userPlan: string
}) {
  const [loading, setLoading] = useState(true)
  const [usedCredits, setUsedCredits] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)

  const [freeTotalCredits, setFreeTotalCredits] = useState(0)
  const [freeTotalUsedCredits, setFreeTotalUsedCredits] = useState(0)
  const [paidTotalCredits, setPaidTotalCredits] = useState(0)
  const [paidTotalUsedCredits, setPaidTotalUsedCredits] = useState(0)

  useEffect(() => {
    async function fetchCreditStats() {
      try {
        const {
          usedCredits,
          totalCredits,
          freeTotalCredits,
          freeTotalUsedCredits,
          paidTotalCredits,
          paidTotalUsedCredits,
        } = await callApi<CreditStats>(
          `/api/admin/credits?filterOutAdmins=${filterOutAdmins}&userPlan=${userPlan}`,
        )
        setUsedCredits(usedCredits)
        setTotalCredits(totalCredits)
        setFreeTotalCredits(freeTotalCredits)
        setFreeTotalUsedCredits(freeTotalUsedCredits)
        setPaidTotalCredits(paidTotalCredits)
        setPaidTotalUsedCredits(paidTotalUsedCredits)
      } catch (error) {
        console.error('Failed to fetch credit stats', error)
        toast.error('Failed to fetch credit stats')
      } finally {
        setLoading(false)
      }
    }

    fetchCreditStats()
  }, [filterOutAdmins, userPlan])

  if (loading) {
    return (
      <div className="flex justify-center items-center w-[500px] h-[300px]">
        <Loader2 className="mr-2 animate-spin" />
        Loading...
      </div>
    )
  }

  const usagePercentage = (usedCredits / totalCredits) * 100

  return (
    <div className="flex flex-col w-[500px]">
      <h2 className="mb-2 w-full text-xl">Credit Usage</h2>
      <div>Total</div>
      <div className="flex items-baseline">
        <span className="text-2xl">{usedCredits.toLocaleString()}</span>
        <span className="ml-2 text-lg text-slate-400">
          / {totalCredits.toLocaleString()} total credits
        </span>
      </div>

      <div className="mt-4">Breakdown</div>
      <div className="flex flex-col">
        <div>Free</div>
        <div className="flex items-baseline">
          {/* breakdown */}

          <span className="text-2xl">
            {freeTotalUsedCredits.toLocaleString()}
          </span>
          <span className="ml-2 text-lg text-slate-400">
            / {freeTotalCredits.toLocaleString()} total credits
          </span>
        </div>

        <div className="mt-2">Paid</div>
        <div className="flex items-baseline">
          <span className="text-2xl">
            {paidTotalUsedCredits.toLocaleString()}
          </span>
          <span className="ml-2 text-lg text-slate-400">
            / {paidTotalCredits.toLocaleString()} used credits
          </span>
        </div>
      </div>

      <div className="mt-2">
        <Badge variant={usagePercentage > 80 ? 'destructive' : 'default'}>
          {usagePercentage.toFixed(2)}% used
        </Badge>
      </div>
    </div>
  )
}
