import { useState, useEffect } from 'react'

import { getLocalHistory } from '@/lib/localHistory'
import { useUser } from '@/lib/useUser'
import { fetchHistoryItems } from '@/requests/historyItem'
import { HistoryItem, SerializedUser } from '@/types'

export function useHistoryItems(chapterIds: number[]): HistoryItem[] {
  const user = useUser()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (chapterIds.length === 0) return

    fetchOrLocalHistoryItems(chapterIds, user).then(setHistoryItems)
  }, [chapterIds, user])

  return historyItems
}

export async function fetchOrLocalHistoryItems(
  chapterIds: number[],
  user: SerializedUser | null,
) {
  let items: HistoryItem[] = []
  if (user) {
    items = await fetchHistoryItems(chapterIds)
  } else {
    items = getLocalHistory(chapterIds)
  }

  return items
}
