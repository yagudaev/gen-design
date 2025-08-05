import toast from 'react-hot-toast'

import { callApi } from '@/lib/callApi'
import { HistoryItemWithChapter } from '@/types'

export async function fetchHistoryItems(chapterIds: number[]) {
  try {
    let { historyItems } = await callApi<{
      historyItems: HistoryItemWithChapter[]
    }>(`/api/historyItems?ids=${chapterIds.join(',')}`)
    // sort the history items by updatedAt in descending order
    historyItems = historyItems.sort((a, b) =>
      a.updatedAt > b.updatedAt ? -1 : 1,
    )
    return historyItems
  } catch (error) {
    console.error('Failed to fetch history items', error)
    toast.error('Failed to fetch history items')

    return []
  }
}
