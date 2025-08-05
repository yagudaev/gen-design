'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import toast from 'react-hot-toast'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { callApi } from '@/lib/callApi'
import { SerializedUser } from '@/types'


export default function EditUserPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const numberKeys = ['usedCredits', 'totalCredits']

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [originalUser, setOriginalUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    const response = await callApi<{ status: String; user: SerializedUser }>(
      `/api/admin/users/${params.id}`,
    )
    if (response.status === 'OK') {
      setUser(response.user)
      setOriginalUser(response.user)
    }
    setIsLoading(false)
  }

  function handleChange(key: string, value: any) {
    setUser((prev: any) => {
      const updatedUser = {
        ...prev,
        [key]: numberKeys.includes(key) ? Number(value) : value,
      }

      const changesExist = Object.entries(updatedUser).some(
        ([k, v]) => v !== originalUser[k],
      )
      setHasChanges(changesExist)
      return updatedUser
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasChanges) return

    setIsSaving(true)

    const changedProperties = Object.entries(user).reduce(
      (acc, [key, value]) => {
        if (value !== originalUser[key]) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    const response = await fetch(`/api/admin/users/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changedProperties),
    })
    setIsSaving(false)
    if (response.ok) {
      toast.success('Changes saved')
      router.push(`/admin/users/${params.id}`)
    } else {
      toast.error('Failed to save changes')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  return (
    <PageBody>
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: user.email, href: `/admin/users/${user.id}` },
          { label: 'Edit', href: `/admin/users/${user.id}/edit` },
        ]}
      />
      <h1 className="mb-6 text-4xl font-bold">Edit User</h1>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(user).map(([key, value]) => {
              if (
                [
                  'id',
                  'createdAt',
                  'updatedAt',
                  'passwordHash',
                  'passwordSalt',
                  'accessToken',
                ].includes(key)
              )
                return null
              return (
                <div key={key}>
                  <Label htmlFor={key}>{formatKey(key)}</Label>
                  <Input
                    id={key}
                    value={value as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              )
            })}
            <Button type="submit" disabled={isSaving || !hasChanges}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageBody>
  )
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
