'use client'

import { User } from '@prisma/client'
import React from 'react'
import toast from 'react-hot-toast'

import { Button, ButtonProps } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'

export function BecomeButton({
  userId,
  ...props
}: { userId: number } & ButtonProps) {
  return (
    <Button
      {...props}
      onClick={async () => {
        try {
          const { user } = await callApi<{ user: User }>(
            `/api/admin/users/${userId}/start-impersonating`,
            { method: 'POST' },
          )

          toast.success('Impersonating user')
          window.open('/projects', 'blank')
        } catch (error) {
          console.error(error)
          toast.error('Failed to impersonate user')
        }
      }}
    >
      Become
    </Button>
  )
}
