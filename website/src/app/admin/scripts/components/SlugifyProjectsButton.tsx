'use client'

import { Button } from '@/components/ui/button'
import { useBatchProcessor } from '@/lib/hooks/useBatchProcessor'

interface Project {
  id: number
  name: string
}

export function SlugifyProjectsButton() {
  const { isProcessing, progress, process } = useBatchProcessor<Project>({
    fetchUrl: '/api/admin/projects/without-slugs',
    processUrl: '/api/admin/projects/slugify',
    resourceKey: 'projects',
  })

  return (
    <Button
      onClick={process}
      disabled={isProcessing}
      className="md:w-min"
      loading={isProcessing}
      loadingLabel="Slugifying..."
      loadingProgress={progress}
    >
      Generate missing project slugs
    </Button>
  )
}
