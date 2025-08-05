'use client'

import { calculatePlaylistProgress } from '@/services/project'
import { Project, HistoryItem } from '@/types'

import PlaylistListeningProgress from './PlaylistListeningProgress'

export default function PlaylistListeningProgressWithFetch({
  chapters,
  historyItems,
}: {
  chapters: Project['chapters']
  historyItems: HistoryItem[]
}) {
  const percentComplete = calculatePlaylistProgress(
    chapters || [],
    historyItems,
  )

  return <PlaylistListeningProgress percentComplete={percentComplete} />
}
