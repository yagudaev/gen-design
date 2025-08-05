import { AdminUser, User as PrismaUser } from '@prisma/client'

import { toJWTAuthUser } from './lib/jwtUser'
import { Chapter, SerializedUser } from './types'

export function serializeChapter(chapter: any): Chapter {
  return {
    ...serializeChapterBasic(chapter),
  }
}

export function serializeChapterBasic(chapter: any): Chapter {
  let url = `/projects/${chapter.projectId}/chapters/${chapter.id}`

  return {
    id: chapter.id,
    name: chapter.name,
    url: url,
    createdAt: chapter.createdAt.toISOString(),
    status: chapter.status,
    order: chapter.order,
    audioUrl: chapter.audioUrl,
    content: chapter.content,
    projectId: chapter.projectId,
    publishedAt: chapter.publishedAt?.toISOString() ?? null,
    sourceUrl: chapter.sourceUrl ?? '',
    fileUrl: chapter.fileUrl,
    voice: chapter.voice,
    openGraphImageUrl: chapter.openGraphImageUrl,
    slug: chapter.slug,
  }
}

export async function serializeUser(
  user: (PrismaUser & { adminUser?: AdminUser | null }) | null,
): Promise<SerializedUser | null> {
  if (!user) return null

  const jwtUser = await toJWTAuthUser(user)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    accessToken: jwtUser.accessToken,
    admin: !!user.adminUser,
    createdAt: serializeDate(user.createdAt),
    updatedAt: serializeDate(user.updatedAt),
  }
}

function serializeDate(date: Date) {
  return date.toISOString()
}
