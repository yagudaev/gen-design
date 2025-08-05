import Logo from '@workspace/shared/Logo'
import Link from 'next/link'

import { MarketingContainer } from '@/components/MarketingContainer'
import { NavLink } from '@/components/NavLink'
import { Button } from '@/components/ui/button'
import config from '@/config'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { serializeUser } from '@/serializers'

import { MobileNavigation } from './MobileNavigation'
import { SearchField } from './SearchField'
import { UserMenu } from './UserMenu'

export async function Header() {
  const session = await auth()
  const user = session?.user
  console.log('user', user)
  const dbUser = user
    ? await prisma.user.findUnique({
        where: { id: Number(user?.id) },
      })
    : null
  const serializedUser = dbUser ? await serializeUser(dbUser) : null

  return (
    <header className="py-5 md:py-10">
      <MarketingContainer>
        <nav className="flex relative z-50 justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo className="w-auto h-10" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {user ? (
                <>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/recent-activity">Recent Activity</NavLink>
                </>
              ) : null}
            </div>
          </div>
          {/* {user && (
            <div>
              <SearchField />
            </div>
          )} */}
          <div className="flex gap-x-5 items-center md:gap-x-8">
            <div className="hidden md:block">
              {serializedUser ? (
                <div className="flex gap-x-2 items-center">
                  <UserMenu user={serializedUser} />
                </div>
              ) : (
                <NavLink href="/login">Sign in</NavLink>
              )}
            </div>
            {!user && (
              <Button color="slate" href={config.earlyAccessUrl}>
                Get Vibeflow
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              {serializedUser && <MobileNavigation user={serializedUser} />}
            </div>
          </div>
        </nav>
      </MarketingContainer>
    </header>
  )
}
