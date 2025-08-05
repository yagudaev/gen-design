'use client'

import { PageBody } from '@/components/PageBody'
import { useTitle } from '@/lib/hooks'

import { AnalyzeChaptersSection } from './components/AnalyzeChaptersSection'
import { PublishChaptersButton } from './components/PublishChaptersButton'
import { SlugifyChaptersButton } from './components/SlugifyChaptersButton'
import { SlugifyProjectsButton } from './components/SlugifyProjectsButton'
import { FetchImagesButton } from './FetchImagesButton'

export default function ScriptsPage() {
  useTitle('Admin Scripts')

  return (
    <PageBody className="mt-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-5xl">Scripts</h1>
      </div>
      <div className="flex flex-col mt-8 space-y-6">
        <FetchImagesButton />
        <AnalyzeChaptersSection />
        <SlugifyChaptersButton />
        <SlugifyProjectsButton />
        <PublishChaptersButton />
      </div>
    </PageBody>
  )
}
