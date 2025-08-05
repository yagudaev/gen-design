import { HistoryItem } from '@/types'

export function calculateListeningProgress(
  chapterId: number,
  historyItems: HistoryItem[],
) {
  const historyItem = historyItems.find((item) => item.chapterId === chapterId)
  const currentTimestamp = historyItem?.currentTimestamp || 0
  const totalDuration = historyItem?.totalDuration || 1
  const percentComplete = Math.round((currentTimestamp / totalDuration) * 100)

  return percentComplete
}
