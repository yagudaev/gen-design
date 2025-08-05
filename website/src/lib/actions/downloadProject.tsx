import JSZip from 'jszip'
import toast from 'react-hot-toast'

import { Project } from '@/types'

export async function downloadProject(project: Project) {
  if (!project.chapters || project.chapters.length <= 0)
    throw new Error('Project has no chapters to download')

  try {
    const zip = new JSZip()
    const fileName = project?.name || 'project'
    const folder = zip.folder(fileName)
    if (!folder) throw new Error('Failed to create folder')

    const fetches = project.chapters
      .map(async (chapter, index) => {
        const currentVersion = chapter.versions?.find(
          (version) => version.voice === chapter.voice,
        )
        if (!currentVersion) return
        if (!currentVersion.audioUrl) return

        const numberPrefix = (index + 1).toString().padStart(3, '0')
        const response = await fetch(currentVersion.audioUrl)
        const data = await response.arrayBuffer()
        folder.file(`${numberPrefix} - ${chapter.name}.mp3`, data)
      })
      .filter(Boolean)

    await Promise.all(fetches)

    const content = await zip.generateAsync({ type: 'blob' })
    const blobUrl = URL.createObjectURL(content)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `${fileName}.zip`
    link.click()

    toast.success('Zip downloaded successfully!')
  } catch (error) {
    console.error('Failed to download zip', error)
    toast.error('Failed to download zip')
  }
}
