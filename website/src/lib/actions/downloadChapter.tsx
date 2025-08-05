'use client'
import toast from 'react-hot-toast'

import { Chapter, Version } from '@/types'

export async function downloadChapter(
  chapter: Chapter,
  currentVersion: Version,
  projectName = 'project',
) {
  try {
    if (!currentVersion.audioUrl) throw new Error('Chapter has no audio')

    const response = await fetch(currentVersion.audioUrl)
    const data = await response.arrayBuffer()

    const blob = new Blob([data], { type: 'audio/mpeg' })
    const blobUrl = URL.createObjectURL(blob)

    const numberPrefix = chapter.order.toString().padStart(3, '0')
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `${projectName} - ${numberPrefix} - ${chapter.name}.mp3`
    link.click()

    toast.success('Chapter downloaded successfully!')
  } catch (error) {
    console.error('Failed to download chapter', error)
    toast.error('Failed to download chapter')
  }
}
