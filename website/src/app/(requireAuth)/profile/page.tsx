'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { TextField } from '@/components/Fields'
import { PageBody } from '@/components/PageBody'
import { callApi } from '@/lib/callApi'
import { useUser } from '@/lib/useUser'
import { SerializedUser } from '@/types'

export default function ProfilePage() {
  const userFromContext = useUser()
  const [user, setUser] = useState(userFromContext)
  const [originalName, setOriginalName] = useState('')

  useEffect(() => {
    setUser(userFromContext)
    setOriginalName(userFromContext?.name ?? '')
  }, [userFromContext])

  return (
    <PageBody className="justify-self-center px-12 mx-auto max-w-7xl h-full min-h-96 grow">
      <section className="relative bg-slate-0">
        <h1 className="text-5xl">Profile</h1>

        <div className="mt-8 space-y-4 max-w-md">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium"
            >
              Name
            </label>
            <TextField
              value={user?.name ?? ''}
              onChange={(e) => {
                setUser(
                  (prevUser) =>
                    ({
                      ...prevUser,
                      name: e.target.value,
                    }) as SerializedUser,
                )
              }}
              onBlur={async () => {
                if (user?.name !== originalName) {
                  const res = await callApi<{ user: any }>('/api/user', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      name: user?.name,
                    }),
                  })

                  if (res.user) {
                    setOriginalName(user?.name ?? '')
                    toast.success('Name updated successfully!')
                  } else {
                    setUser(
                      (prevUser) =>
                        ({
                          ...prevUser,
                          name: originalName,
                        }) as SerializedUser,
                    )
                    toast.error('Failed to update name')
                  }
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <TextField
              value={user?.email ?? ''}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </section>
    </PageBody>
  )
}
