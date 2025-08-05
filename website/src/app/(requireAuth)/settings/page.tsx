'use client'

import {
  SelectItem,
  SimpleSelect,
} from '@workspace/shared/components/ui/select'
import { cn, formatNumber } from '@workspace/shared/utils'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { BuyMoreCredits } from '@/components/BuyMoreCredits'
import { TextField } from '@/components/Fields'
import { PageBody } from '@/components/PageBody'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea' // Make sure this import exists or add it
import { updateVoice } from '@/lib/actions/updateVoice'
import { callApi } from '@/lib/callApi'
import { estimateDuration } from '@/lib/estimateCosts'
import { canUseCustomOpenAIToken } from '@/lib/featureFlags'
import { useUser } from '@/lib/useUser'
import { SerializedUser } from '@/types'

export default function SettingsPage() {
  const userFromContext = useUser()
  const [user, setUser] = useState(userFromContext)

  useEffect(() => {
    setUser(userFromContext)
  }, [userFromContext])

  // const allowCustomOpenAIKey = canUseCustomOpenAIToken(user)
  const allowCustomOpenAIKey = true
  // Credit functionality has been removed
  const remainingCredits = 0
  const usedCredits = 0
  const totalCredits = 1
  const usedCreditsPercentage = 0

  async function handleOpenBilling() {
    try {
      const res = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`Error opening billing portal ${data.error}`)
      }

      toast.success('Opening billing portal...')
      window.location.href = data.url
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error('Error opening billing portal. Please try again.')
    }
  }

  async function updateSetting(key: string, value: boolean | string) {
    // Optimistic update
    const prevUser = { ...user }
    setUser(
      (user) =>
        ({
          ...user,
          [key]: value,
        }) as SerializedUser,
    )

    const res = await callApi<{ user: SerializedUser | null }>('/api/user', {
      method: 'PATCH',
      body: JSON.stringify({ [key]: value }),
    })

    if (res.user) {
      toast.success(`Successfully updated ${key}`)
    } else {
      // Revert optimistic update on failure
      setUser(
        (user) =>
          ({
            ...user,
            [key]: (prevUser as any)[key],
          }) as SerializedUser,
      )
      toast.error(`Failed to update ${key}`)
      return false
    }

    return true
  }

  return (
    <PageBody className="justify-self-center px-12 mx-auto max-w-7xl h-full min-h-96 grow">
      <section className="relative bg-slate-0">
        <h1 className="text-5xl">Settings</h1>
        {user?.admin && <Badge className="mt-2">Admin</Badge>}

        <SettingsCheckbox
          id="debugMode"
          label="Debug Mode"
          checked={false}
          onChange={async (checked) => {
            await updateSetting('debug', checked)
          }}
          adminOnly
          className="mt-6"
        />

        {/* Voice functionality has been removed */}

        {user?.admin && (
          // select conversion service, use SimpleSelect
          <div className="flex mt-6">
            <SimpleSelect
              placeholder="Conversion Service"
              value={'openai'}
              onValueChange={(value: string) => {
                updateSetting('conversionService', value)
              }}
            >
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="azure">Azure</SelectItem>
            </SimpleSelect>
          </div>
        )}

        {user?.admin && (
          <div className="flex items-center mt-6">
            <Switch
              id="enableFallbackService"
              checked={false}
              onCheckedChange={(checked) => {
                updateSetting('enableFallbackService', checked)
              }}
            />
            <label htmlFor="enableFallbackService" className="ml-2">
              Enable Fallback Service
            </label>
          </div>
        )}

        {/* AI Context functionality has been removed */}

        {/* Credit functionality has been removed */}

        {/* <hr className="my-6" />
        <div className="mt-8">
          <Button onClick={handleOpenBilling} variant={'outline'}>
            Open Billing Settings
          </Button>
        </div> */}
      </section>
    </PageBody>
  )
}

interface SettingsCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => Promise<void>
  adminOnly?: boolean
  className?: string
}

function SettingsCheckbox({
  id,
  label,
  checked,
  onChange,
  adminOnly = false,
  className = '',
  ...divProps
}: SettingsCheckboxProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>) {
  const user = useUser()

  if (adminOnly && !user?.admin) return null

  return (
    <div className={cn('flex items-center', className)} {...divProps}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={async (checkedState) => {
          const checked =
            checkedState === 'indeterminate' ? false : checkedState
          await onChange(checked)
        }}
      />
      <label htmlFor={id} className="ml-2">
        {label}
      </label>
    </div>
  )
}
