import config from '@/config'
import { Project, Chapter } from '@/types'

const BASE_URL = config.baseUrl

export function getPodcastUrl(project: Project) {
  return `${BASE_URL.replace(/https?:\/\//, '')}/podcasts/${
    project?.podcastToken
  }`
}
