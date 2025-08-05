'use client'

import { useMemo } from 'react'

import { Progress } from '@/components/ui/progress'
import { useHistoryItems } from '@/hooks/historyItem'
import { useUser } from '@/lib/useUser'
import { calculatePlaylistProgress } from '@/services/project'
import { Chapter, Project } from '@/types'

export function OverallListeningProgress({
  project,
}: {
  project: Project & { chapters: Chapter[] }
}) {
  const user = useUser()
  const chapterIds = useMemo(
    () => project.chapters.map((c) => c.id),
    [project.chapters],
  )
  const historyItems = useHistoryItems(chapterIds)

  const userId = user?.id
  const overallProgress = userId
    ? calculatePlaylistProgress(project.chapters, historyItems)
    : 0

  return (
    <>
      <Progress
        value={overallProgress}
        className="flex-1"
        aria-label="Overall Listening Progress"
      />
      <span className="w-12 text-xs text-muted-foreground">
        {overallProgress}%
      </span>
    </>
  )
}
