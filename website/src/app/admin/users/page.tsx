'use client'

import { AdminUser } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateShort } from '@workspace/shared/utils'
import { sha256 } from 'js-sha256'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'
import { SortableColumnHeader } from '@/components/SortableColumnHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { callApi } from '@/lib/callApi'
import { useTitle } from '@/lib/hooks'
import { SerializedUser } from '@/types'

type Scope = 'all' | 'pro' | 'admin'

export default function UsersPage() {
  useTitle('Admin Users')

  const [scope, setScope] = useState<Scope>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [allUsers, setAllUsers] = useState<SerializedUser[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    fetchUsers()
    fetchAdminUsers()
  }, [])

  // scopes - simplified since plan field is removed
  const adminUserIds = adminUsers.map((au) => au.userId)

  // apply scope
  const users = allUsers.filter((user) => {
    if (scope === 'all') return true
    if (scope === 'pro') return false // No pro users since plan field is removed
    if (scope === 'admin') return adminUserIds.includes(user.id)
    return true
  })

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchFields = [user.name, user.email]
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    })
  }, [users, searchTerm])

  async function fetchUsers() {
    try {
      const { users } = await callApi<{ users: any[] }>('/api/admin/users')
      setAllUsers(users)
    } catch (error) {
      console.error('Failed to fetch users', error)
      toast.error('Failed to fetch users')
    }
  }

  async function fetchAdminUsers() {
    try {
      const { adminUsers } = await callApi<{ adminUsers: AdminUser[] }>(
        '/api/admin/adminUsers',
      )
      setAdminUsers(adminUsers)
    } catch (error) {
      console.error('Failed to fetch admin users', error)
      toast.error('Failed to fetch admin users')
    }
  }

  return (
    <PageBody className="mt-8">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }]} />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-5xl">Users</h1>
        {/* <div className="flex justify-between mt-8 md:mt-0">
          <div>
            <Button href="/admin/users/new">New User</Button>
          </div>
        </div> */}
      </div>

      {/* Add search box */}
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* scopes */}
      <div className="flex mt-2 space-x-4">
        <div>
          <span>Total Users:</span>
          <Button
            variant="link"
            className="text-left"
            onClick={() => setScope('all')}
          >
            {allUsers.length}
          </Button>
        </div>
        <div>
          <span>Pro Users:</span>
          <Button
            variant="link"
            className="text-left"
            onClick={() => setScope('pro')}
          >
            0 (removed)
          </Button>
        </div>
        <div>
          <span>Admin Users:</span>
          <Button
            variant="link"
            className="text-left"
            onClick={() => setScope('admin')}
          >
            {adminUsers.length}
          </Button>
        </div>
      </div>

      <DataTable
        className="mt-8"
        columns={
          [
            {
              id: 'avatar',
              header: 'Avatar',
              accessorKey: 'email',
              cell: ({ getValue }) => {
                const email = getValue<string>()
                const hash = sha256(email.trim().toLowerCase())

                return (
                  <Image
                    height={32}
                    width={32}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                    src={`https://www.gravatar.com/avatar/${hash}?d=identicon`}
                  />
                )
              },
            },
            {
              header: ({ column }) => {
                return (
                  <SortableColumnHeader column={column}>
                    Name
                  </SortableColumnHeader>
                )
              },
              accessorKey: 'name',
            },
            {
              header: ({ column }) => {
                return (
                  <SortableColumnHeader column={column}>
                    Email
                  </SortableColumnHeader>
                )
              },
              accessorKey: 'email',
              cell: ({ getValue, row }) => {
                const email = getValue<string>()
                const id = row.original.id
                return (
                  <Button variant="link" href={`/admin/users/${id}`}>
                    {email}
                  </Button>
                )
              },
            },
            // Plan column removed
            {
              header: ({ column }) => {
                return (
                  <SortableColumnHeader column={column}>
                    Created At
                  </SortableColumnHeader>
                )
              },
              accessorKey: 'createdAt',
              cell: ({ getValue }) => {
                const value = getValue<string>()
                return formatDateShort(new Date(value))
              },
            },
            {
              id: 'otherInfo',
              header: 'Other Info',
              accessorKey: 'email',
              // get data from gavatar json and display raw json in the cell using json stringify
              cell: ({ getValue }) => {
                const email = getValue<string>()

                return <OtherInfo email={email} />
              },
            },
          ] as ColumnDef<any>[]
        }
        data={filteredUsers}
      />
    </PageBody>
  )
}

function OtherInfo({ email }: { email: string }) {
  const [data, setData] = useState<any>()
  const [error, setError] = useState<string | null>()
  useEffect(() => {
    fetchAdditionalData()
  }, [])

  async function fetchAdditionalData() {
    const hash = sha256(email.trim().toLowerCase())
    try {
      const res = await fetch(`https://gravatar.com/${hash}.json`)
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch additional data', error)
      setError('Failed to fetch additional data')
    }
  }

  if (error) return <div>{error}</div>

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
