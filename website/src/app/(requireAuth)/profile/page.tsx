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
  const [originalFirstName, setOriginalFirstName] = useState('')
  const [originalLastName, setOriginalLastName] = useState('')

  useEffect(() => {
    setUser(userFromContext)
    setOriginalFirstName(userFromContext?.firstName ?? '')
    setOriginalLastName(userFromContext?.lastName ?? '')
  }, [userFromContext])

  return (
    <PageBody className="justify-self-center px-12 mx-auto max-w-7xl h-full min-h-96 grow">
      <section className="relative bg-slate-0">
        <h1 className="text-5xl">Profile</h1>

        <div className="mt-8 space-y-4 max-w-md">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium"
              >
                First Name
              </label>
              <TextField
                value={user?.firstName ?? ''}
                onChange={(e) => {
                  setUser(
                    (prevUser) =>
                      ({
                        ...prevUser,
                        firstName: e.target.value,
                      }) as SerializedUser,
                  )
                }}
                onBlur={async () => {
                  if (user?.firstName !== originalFirstName) {
                    const res = await callApi<{ user: any }>('/api/user', {
                      method: 'PATCH',
                      body: JSON.stringify({
                        firstName: user?.firstName,
                      }),
                    })

                    if (res.user) {
                      setOriginalFirstName(user?.firstName ?? '')
                      toast.success('First name updated successfully!')
                    } else {
                      setUser(
                        (prevUser) =>
                          ({
                            ...prevUser,
                            firstName: originalFirstName,
                          }) as SerializedUser,
                      )
                      toast.error('Failed to update first name')
                    }
                  }
                }}
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium"
              >
                Last Name
              </label>
              <TextField
                value={user?.lastName ?? ''}
                onChange={(e) => {
                  setUser(
                    (prevUser) =>
                      ({
                        ...prevUser,
                        lastName: e.target.value,
                      }) as SerializedUser,
                  )
                }}
                onBlur={async () => {
                  if (user?.lastName !== originalLastName) {
                    const res = await callApi<{ user: any }>('/api/user', {
                      method: 'PATCH',
                      body: JSON.stringify({
                        lastName: user?.lastName,
                      }),
                    })

                    if (res.user) {
                      setOriginalLastName(user?.lastName ?? '')
                      toast.success('Last name updated successfully!')
                    } else {
                      setUser(
                        (prevUser) =>
                          ({
                            ...prevUser,
                            lastName: originalLastName,
                          }) as SerializedUser,
                      )
                      toast.error('Failed to update last name')
                    }
                  }
                }}
              />
            </div>
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
