import type { JWTPayload } from 'jose'

// TODO: rename to AuthUser
// next-auth user
export interface User {
  id: string
  name: string | null
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface SerializedUser {
  id: number
  name: string | null
  email: string
  accessToken: string
  admin: boolean

  createdAt: string
  updatedAt: string
}

export interface JWTUserInfo extends JWTPayload {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// client side
export interface Project {
  id: number
  name: string
  url: string
  createdAt: string
  status: string
  chapters?: Chapter[]
  podcastToken: string | null
  voice?: string
  fileUrl: string | null
  slug: string | null
  coverUrl: string | null
}

export interface ProjectWithChapters extends Project {
  chapters: Chapter[]
}

export interface ProjectWithDownloadStatus extends Project {
  availableForDownload: boolean
  listeningProgress: number
  duration?: number
}

export interface Chapter {
  id: number
  name: string
  url: string
  createdAt: string
  status: string
  order: number

  /** @deprecated Use audioUrl on Version instead */
  audioUrl: string | null
  content: string
  projectId: number
  // project: Project
  publishedAt: string | null

  openGraphImageUrl?: string | null
  sourceUrl: string
  coverUrl?: string
  thumbnailUrl?: string
  fileUrl?: string | null
  voice: string | null
  versions?: Version[]

  slug: string | null
}

export interface Version {
  id: number
  chapterId: number
  // chapter: Chapter

  // content: string
  voice: string | null
  audioUrl: string | null
  createdAt: string
  updatedAt: string
  chunks?: Chunk[]

  status: string
  duration: number | null
}

export interface HistoryItem {
  id: number
  chapterId: number
  userId: number
  currentTimestamp: number
  totalDuration: number
  createdAt: string
  updatedAt: string
}

export interface HistoryItemWithChapter extends HistoryItem {
  chapter: Chapter
}

export interface Chunk {
  id: number
  order: number
  content: string
  audioUrl: string | null
  status: string
  chapterId: number
  versionId: number | null
  version?: Version
}

export interface ChatMessage {
  id: number
  projectId: number
  role: string
  content: string
  createdAt: string
  updatedAt: string
}

// Admin
export interface CreditStats {
  usedCredits: number
  totalCredits: number
  freeTotalCredits: number
  freeTotalUsedCredits: number
  paidTotalCredits: number
  paidTotalUsedCredits: number
}

export interface DomainStats {
  domain: string
  count: number
}

export interface AdminChapter extends Omit<Chapter, 'project' | 'url'> {
  id: number
  name: string
  createdAt: string
  projectName: string
  user: {
    id: number
    name: string | null
    email: string
  }
}

export interface AdminVersion extends Version {
  createdAt: string
  updatedAt: string
}
