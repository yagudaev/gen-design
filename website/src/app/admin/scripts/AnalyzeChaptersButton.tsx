'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'

interface Props {
  projectIds?: string[]
  includePublishedDate?: boolean
}

export function AnalyzeChaptersButton({
  projectIds,
  includePublishedDate,
}: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  const analyzeChaptersWithAI = async () => {
    setIsAnalyzing(true)
    try {
      const searchParams = new URLSearchParams()
      if (projectIds?.length) {
        searchParams.set('projectIds', projectIds.join(','))
      }
      if (includePublishedDate) {
        searchParams.set('includePublishedDate', 'true')
      }

      const { chapterIds } = await callApi<{ chapterIds: number[] }>(
        `/api/admin/chapters/unanalyzed?${searchParams.toString()}`,
        { method: 'GET' },
      )
      const unanalyzedChapters = chapterIds

      const chunkSize = 5
      let chunks = []
      for (let i = 0; i < unanalyzedChapters.length; i += chunkSize) {
        chunks.push(unanalyzedChapters.slice(i, i + chunkSize))
      }

      for (let i = 0; i < chunks.length; i++) {
        try {
          await callApi('/api/admin/chapters/analyze', {
            method: 'POST',
            body: JSON.stringify({
              chapterIds: chunks[i],
              includePublishedDate,
            }),
          })
        } catch (error) {
          console.error('Failed to analyze chapters', error)
          toast.error(
            `Failed to analyze chapters ${chunks[i].join(', ')} skipping them`,
          )
        }
        const progress = ((i + 1) / chunks.length) * 100
        setProgress(progress)
      }

      toast.success('All chapters analyzed successfully')
    } catch (error) {
      console.error('Failed to analyze chapters', error)
      toast.error('Failed to analyze chapters')
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <Button
      onClick={analyzeChaptersWithAI}
      disabled={isAnalyzing}
      className="md:w-min"
      loading={isAnalyzing}
      loadingLabel="Analyzing..."
      loadingProgress={progress}
    >
      Analyze chapters with AI
    </Button>
  )
}
