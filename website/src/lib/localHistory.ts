import { HistoryItemWithChapter } from '@/types'

const LOCAL_HISTORY_KEY = 'chapter_history'

// Update HistoryItem type or create a new one
type LocalHistoryItem = Omit<
  HistoryItemWithChapter,
  'id' | 'createdAt' | 'updatedAt' | 'chapter' | 'userId'
> & {
  id?: number
  createdAt?: string
  updatedAt?: string
}

export function getLocalHistory(
  chapterIds: number[],
): HistoryItemWithChapter[] {
  try {
    const stored = localStorage.getItem(LOCAL_HISTORY_KEY)
    const history: Record<string, HistoryItemWithChapter> = stored
      ? JSON.parse(stored)
      : {}

    return chapterIds
      .map((id) => history[id])
      .filter(Boolean)
      .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
  } catch (e) {
    return []
  }
}

export function saveLocalHistory(item: LocalHistoryItem) {
  try {
    const stored = localStorage.getItem(LOCAL_HISTORY_KEY)
    const history: Record<
      string,
      Omit<HistoryItemWithChapter, 'chapter'>
    > = stored ? JSON.parse(stored) : {}
    const now = new Date().toISOString()

    history[item.chapterId] = {
      ...item,
      id: item.id ?? generateLocalId(),
      userId: -1,
      createdAt: item.createdAt ?? now,
      updatedAt: now,
    }

    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save local history', e)
  }
}

function generateLocalId() {
  return -Math.floor(Math.random() * 1000000)
}
