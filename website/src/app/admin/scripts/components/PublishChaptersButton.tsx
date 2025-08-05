'use client'

import { Button } from '@/components/ui/button'
import { useBatchProcessor } from '@/lib/hooks/useBatchProcessor'

interface Chapter {
  id: number
  name: string
}

export function PublishChaptersButton() {
  const { isProcessing, progress, process } = useBatchProcessor<Chapter>({
    fetchUrl: '/api/admin/chapters/unpublished-on-public',
    processUrl: '/api/admin/chapters/publish',
    resourceKey: 'chapters',
  })

  return (
    <Button
      onClick={process}
      disabled={isProcessing}
      className="md:w-min"
      loading={isProcessing}
      loadingLabel="Publishing..."
      loadingProgress={progress}
    >
      Publish chapters on public projects
    </Button>
  )
}
