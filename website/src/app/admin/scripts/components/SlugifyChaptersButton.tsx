'use client'

import { Button } from '@/components/ui/button'
import { useBatchProcessor } from '@/lib/hooks/useBatchProcessor'

interface Chapter {
  id: number
  name: string
}

export function SlugifyChaptersButton() {
  const { isProcessing, progress, process } = useBatchProcessor<Chapter>({
    fetchUrl: '/api/admin/chapters/without-slugs',
    processUrl: '/api/admin/chapters/slugify',
    resourceKey: 'chapters',
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
      Generate missing chapter slugs
    </Button>
  )
}
