'use client'
import { deleteAt, insertAt } from '@workspace/shared/utils'
import React from 'react'
import toast from 'react-hot-toast'

import { callApi } from '@/lib/callApi'
import { Chapter } from '@/types'

export async function deleteChapter(
  chapter: Chapter,
  {
    beforeDelete,
    afterDelete,
    onError,
  }: {
    beforeDelete?: () => void
    afterDelete?: () => void
    onError?: (e: any) => void
  } = {},
) {
  if (confirm('Are you sure you want to delete this chapter?')) {
    const chapterId = chapter.id
    const projectId = chapter.projectId

    beforeDelete?.()

    try {
      const { chapter } = await callApi<{ chapter: Chapter }>(
        `/api/projects/${projectId}/chapters/${chapterId}`,
        {
          method: 'DELETE',
        },
      )
      toast.success('Chapter deleted successfully!')
      afterDelete?.()

      return chapter
    } catch (e: any) {
      toast.error('Failed to delete chapter')

      onError?.(e)
    }
  }
}
export async function deleteChapterOptimistic(
  chapter: Chapter,
  allChapters: Chapter[],
  setAllChapters: React.Dispatch<React.SetStateAction<Chapter[]>>,
) {
  const chapterId = chapter.id
  const deletedPosition = allChapters.findIndex((p) => p.id === chapterId)

  await deleteChapter(chapter, {
    beforeDelete: () => {
      setAllChapters((chapters) => deleteAt(chapters, deletedPosition))
    },
    onError: () =>
      // add the chapter back to the list
      setAllChapters((chapters) =>
        insertAt(chapters, deletedPosition, chapter),
      ),
  })
}
