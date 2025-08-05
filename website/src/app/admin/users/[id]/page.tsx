import { User } from '@prisma/client'
import { formatDateShort, formatNumber } from '@workspace/shared/utils'
import Link from 'next/link'
import { DateRange } from 'react-day-picker'


import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { prisma } from '@/lib/db'

import { BecomeButton } from './BecomeButton'

export default async function UserPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    include: {},
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <PageBody className="container py-10 mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: user.email, href: `/admin/users/${user.id}` },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">User Details</h1>

        <div className="flex gap-1">
          {/* stripe */}
          {user.plan === 'pro' && user.stripeCustomerId && (
            <Button
              variant="outline"
              href={`https://manage.stripe.com/customers/${user.stripeCustomerId}`}
              className="mr-4"
            >
              Stripe
            </Button>
          )}
          <Button
            variant="outline"
            href={`https://us.posthog.com/project/104579/person/${encodeURIComponent(
              user.id,
            )}`}
            className="mr-4"
          >
            PostHog
          </Button>
          <BecomeButton userId={user.id} className="mr-4" variant="outline" />
          <Button href={`/admin/users/${user.id}/edit`}>Edit User</Button>
          {/* add a button to reset the user's password */}
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-grow max-w-[936px]">
          <OverviewCard user={user} />
        </div>
        <div className="w-64">
          {/* <StatsCard
            user={user}
            totalChapters={totalChapters}
            totalPodcastEpisodes={totalPodcastEpisodes}
            totalProcessedChapters={totalProcessedChapters}
          /> */}
        </div>
      </div>

      {/* TODO: show relationships and stats like number of projects, chapters, etc */}
    </PageBody>
  )
}

function OverviewCard({ user }: { user: User }) {
  const { passwordHash, passwordSalt, ...displayUser } = user

  return (
    <Card className="overflow-scroll">
      <CardContent>
        <h2 className="mt-4 mb-4 text-2xl font-semibold">Overview</h2>
        <Table>
          <TableBody>
            {Object.entries(displayUser).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{formatKey(key)}</TableCell>
                <TableCell>{formatValue(value, key)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StatsCard({
  user,
  totalChapters,
  totalPodcastEpisodes,
  totalProcessedChapters,
}: {
  user: User & { _count: { projects: number; historyItems: number } }
  totalChapters: number
  totalPodcastEpisodes: number
  totalProcessedChapters: number
}) {
  // All time dates
  let from = new Date('2024-04-15')
  const to = new Date()
  const dateRange: DateRange = { from, to }

  return (
    <Card>
      <CardContent>
        <h2 className="mt-4 mb-4 text-2xl font-semibold">Stats</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Projects</TableCell>
              <TableCell>{user._count.projects}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Chapters</TableCell>
              <TableCell>{totalChapters}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Processed Chapters</TableCell>
              <TableCell>{totalProcessedChapters}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Podcast Episodes</TableCell>
              <TableCell>{totalPodcastEpisodes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">In-App Listening</TableCell>
              <TableCell>{user._count.historyItems}</TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell colSpan={2}>
                <ContentSourcesCard
                  className="w-full"
                  dateRange={dateRange}
                  filterOutAdmins={false}
                  userPlan={user.plan}
                  userIds={[user.id]}
                />
              </TableCell>
            </TableRow> */}
            {/* <TableRow>
              <TableCell colSpan={2}>
                <TopFileTypesCard
                  className="w-full"
                  dateRange={dateRange}
                  filterOutAdmins={false}
                  userPlan={user.plan}
                  userIds={[user.id]}
                />
              </TableCell>
            </TableRow> */}
            {/* Add more stats here as needed */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatValue(value: any, key: string): string {
  if (value === null) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  if (key === 'createdAt' || key === 'updatedAt') return formatDateShort(value)
  if (key === 'plan') return value === 'pro' ? 'Pro' : 'Free'
  if (key === 'usedCredits' || key === 'totalCredits')
    return formatNumber(value)

  return String(value)
}
