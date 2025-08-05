import { Chapter, HistoryItem } from '@/types'

import { calculateListeningProgress } from './chapter'

export function calculatePlaylistProgress(
  chapters: Chapter[],
  historyItems: HistoryItem[],
) {
  if (!chapters?.length) return 0

  const totalProgress = chapters.reduce((sum, chapter) => {
    return sum + calculateListeningProgress(chapter.id, historyItems)
  }, 0)

  return Math.round(totalProgress / chapters.length)
}
