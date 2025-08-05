import { chunk } from '@/lib/chunk'

export interface Chapter {
  name: string
  order: number
  content: string
  rawContent: string
  sourceUrl: string | null
  thumbnailUrl: string | null
  coverUrl: string | null
}
const LONG_CHAPTER_THRESHOLD = 60_000 // 60K characters is 60 mins of audio

export function splitLongChapters<R extends Chapter>(chapters: R[]) {
  const newChapters: Chapter[] = []
  for (const chapter of chapters) {
    newChapters.push(...splitLongChapter(chapter))
  }

  return newChapters as R[]
}
function splitLongChapter(chapter: Chapter) {
  if (chapter.content.length <= LONG_CHAPTER_THRESHOLD) {
    return [chapter]
  }

  const chunks = chunk(chapter.content, LONG_CHAPTER_THRESHOLD)
  return chunks.map((content, index) => ({
    ...chapter,
    name: `${chapter.name} - Part ${index + 1}`,
    order: chapter.order + index,
    content,
  }))
}
