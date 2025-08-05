import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { AdminHeader } from '@/components/AdminHeader'
import { AppFooter } from '@/components/AppFooter'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// runs on the server
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode
}) {
  const user = await fetchCurrentUser()

  if (!user || !user.adminUser) {
    redirect('/login')
  }

  return (
    <>
      <AdminHeader />
      {children}
      <AppFooter />
    </>
  )
}

async function fetchCurrentUser() {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return null
  return fetchUser(Number(session.user.id))
}

async function fetchUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { adminUser: true },
  })
  return user
}
