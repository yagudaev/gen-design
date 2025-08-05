import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'
import { Button } from '@/components/ui/button'

interface ResourceNotFoundProps {
  resourceName?: string
  breadcrumbs?: Array<{ label: string; href: string }>
}

export function ResourceNotFound({
  resourceName = 'Resource',
  breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
  ],
}: ResourceNotFoundProps) {
  return (
    <PageBody>
      <section className="relative bg-slate-0">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">{resourceName} Not Found</h1>
          <p className="mb-8 text-slate-600">
            The {resourceName.toLowerCase()} you&apos;re looking for
            doesn&apos;t exist or has been deleted.
          </p>
          <Button
            href={breadcrumbs[breadcrumbs.length - 1].href}
            className="px-12"
          >
            Back to {breadcrumbs[breadcrumbs.length - 1].label}
          </Button>
        </div>
      </section>
    </PageBody>
  )
}
