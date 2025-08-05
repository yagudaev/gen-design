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
  const remainingCredits = user
    ? Math.max(user.totalCredits - user.usedCredits, 0)
    : 0
  const usedCredits = user?.usedCredits ?? 0
  const totalCredits = user?.totalCredits ?? 1
  const usedCreditsPercentage = Math.min(
    (usedCredits / totalCredits) * 100,
    100,
  )

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

        <div className="flex mt-6">
          <SimpleSelect
            placeholder="Select Voice"
            value={user?.voice || 'echo'}
            onValueChange={(voice) => {
              setUser((prevUser) => ({ ...prevUser, voice }) as SerializedUser)
            }}
          >
            <SelectItem value="echo">Echo</SelectItem>
            <SelectItem value="alloy">Alloy</SelectItem>
            <SelectItem value="fable">Fable</SelectItem>
            <SelectItem value="onyx">Onyx</SelectItem>
            <SelectItem value="nova">Nova</SelectItem>
            <SelectItem value="shimmer">Shimmer</SelectItem>
          </SimpleSelect>

          <Button
            variant={'outline'}
            className="ml-4"
            onClick={async () => {
              const voice = user?.voice
              if (!voice) {
                toast.error('Voice not set')
                return
              }
              await updateVoice(voice)
              toast.success('Voice updated')
            }}
          >
            Update
          </Button>

          <Button href="/voices" variant={'link'} className="ml-4">
            explore voices
          </Button>
        </div>

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

        <div className="mt-6">
          <label htmlFor="aiContext" className="block mb-2 font-medium">
            AI Context
          </label>
          <Textarea
            id="aiContext"
            placeholder="Enter additional context about yourself and your goals for the AI..."
            value={user?.aiContext ?? ''}
            onChange={(e) => {
              setUser(
                (prevUser) =>
                  ({
                    ...prevUser,
                    aiContext: e.target.value,
                  }) as SerializedUser,
              )
            }}
            rows={4}
            className="w-full max-w-xl"
          />
          <Button
            variant={'outline'}
            className="mt-2"
            onClick={async () => {
              const res = await callApi<{ user: any }>('/api/user', {
                method: 'PATCH',
                body: JSON.stringify({
                  aiContext: user?.aiContext,
                }),
              })

              if (res.user) {
                toast.success('AI Context updated successfully!')
              } else {
                toast.error('Failed to update AI Context')
              }
            }}
          >
            Update AI Context
          </Button>
        </div>

        <div className="mt-8 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Credits Used</span>
            <span className="text-sm font-medium">
              {formatNumber(user?.usedCredits ?? 0)} /{' '}
              {formatNumber(user?.totalCredits ?? 0)}
            </span>
          </div>
          <Progress value={usedCreditsPercentage} className="h-2" />
          <div className="mt-1 text-sm text-muted-foreground">
            {formatNumber(remainingCredits)} credits remaining (
            {estimateDuration(remainingCredits)} of audio)
          </div>
          <BuyMoreCredits label="Buy more credits for $15" className="mt-4" />
        </div>

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
