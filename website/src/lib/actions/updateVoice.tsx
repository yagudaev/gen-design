import { callApi } from '@/lib/callApi'
import { SerializedUser, Chapter, Project } from '@/types'

interface UpdateVoiceBody {
  voice: string
  projectId?: number
  chapterId?: number
}

export async function updateVoice(
  voice: string,
  projectId?: number,
  chapterId?: number,
) {
  let endpoint = '/api/user'
  let body: UpdateVoiceBody = { voice }

  if (projectId && chapterId) {
    endpoint = `/api/projects/${projectId}/chapters/${chapterId}`
    body = { ...body, projectId, chapterId }
  } else if (projectId) {
    endpoint = `/api/projects/${projectId}`
    body = { ...body, projectId }
  }

  const res = await callApi<{
    user: SerializedUser | undefined
    chapter: Chapter | undefined
    project: Project | undefined
  }>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

  if (res.user || res.chapter || res.project) {
    return res.user || res.chapter || res.project
  } else {
    throw new Error('Failed to update voice')
  }
}
