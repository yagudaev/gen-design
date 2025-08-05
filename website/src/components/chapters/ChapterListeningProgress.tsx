'use client'

import { Progress } from '@/components/ui/progress'
import { calculateListeningProgress } from '@/services/chapter'
import { HistoryItem } from '@/types'

export default function ChapterListeningProgress({
  chapterId,
  historyItems,
}: {
  chapterId: number
  historyItems: HistoryItem[]
}) {
  const percentComplete = calculateListeningProgress(chapterId, historyItems)

  return (
    <div className="flex items-center gap-4 w-[200px]">
      <Progress
        value={percentComplete}
        className="flex-1"
        aria-label="Listening Progress"
      />
      <span className="w-12 text-xs text-muted-foreground">
        {percentComplete}%
      </span>
    </div>
  )
}
