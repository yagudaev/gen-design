import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { AppFooter } from '@/components/AppFooter'
import { Header } from '@/components/Header'
import { auth } from '@/lib/auth'

// runs on the server
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      {children}
      <AppFooter />
    </>
  )
}
