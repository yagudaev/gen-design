'use client'

import { getSession } from 'next-auth/react'
import { useEffect, useState, createContext, useContext } from 'react'

import { SerializedUser } from '@/types'

export function useUser() {
  const user = useContext(UserContext)

  return user
}

export const UserContext = createContext<SerializedUser | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SerializedUser | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])
  async function fetchUser() {
    const session = await getSession()
    if (session?.user) {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUser({
        ...data.user,
        impersonating: (session as any).impersonating ?? false,
      })
    }
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
