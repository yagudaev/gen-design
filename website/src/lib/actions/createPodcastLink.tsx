'use client'
import toast from 'react-hot-toast'

import { callApi } from '@/lib/callApi'
import { Project } from '@/types'

export async function createPodcastLink(
  project: Project,
  { onSuccess }: { onSuccess?: (project: Project) => void } = {},
) {
  try {
    const projectId = project.id
    const { project: updatedProject } = await callApi<{
      project: Project
    }>(`/api/projects/${projectId}/podcast-link`, {
      method: 'POST',
    })

    onSuccess?.(updatedProject)
  } catch (error) {
    console.error('Failed to get RSS link', error)
    toast.error('Failed to get RSS link')
  }
}
