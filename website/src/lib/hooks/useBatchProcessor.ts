import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { callApi } from '@/lib/callApi'
import { inGroupsOf } from '@/lib/utils'

interface BatchProcessorOptions<T extends { id: number }> {
  fetchUrl: string
  processUrl: string
  batchSize?: number
  resourceKey: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useBatchProcessor<T extends { id: number }>({
  fetchUrl,
  processUrl,
  batchSize = 5,
  resourceKey,
  onSuccess,
  onError,
}: BatchProcessorOptions<T>) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const process = async () => {
    setIsProcessing(true)
    try {
      const response = await callApi<Record<string, T[]>>(fetchUrl, {
        method: 'GET',
      })
      const items = response[resourceKey]

      const groups = inGroupsOf(items, batchSize)
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < groups.length; i++) {
        try {
          await callApi(processUrl, {
            method: 'POST',
            body: JSON.stringify({ [resourceKey]: groups[i] }),
          })
          successCount += groups[i].length
        } catch (error) {
          console.error('Failed to process batch', error)
          toast.error(
            `Failed to process ${resourceKey} ${groups[i].map((item) => item.id).join(', ')}, skipping them`,
          )
          onError?.(error)

          errorCount += groups[i].length
        }
        const progress = ((i + 1) / groups.length) * 100
        setProgress(progress)
      }

      toast.success(
        `${successCount} ${resourceKey} processed successfully, ${errorCount} failed`,
      )
      onSuccess?.()
    } catch (error) {
      console.error(`Failed to process ${resourceKey}`, error)
      toast.error(`Failed to process ${resourceKey}`)
      onError?.(error)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return {
    isProcessing,
    progress,
    process,
  }
}
