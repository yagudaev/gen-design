import fs from 'fs/promises'
import path from 'path'

import matter from 'gray-matter'

import { prisma } from '@/lib/db'
import { serializeChapter } from '@/serializers'
import { Chapter } from '@/types'

const AUDIOWAVE_BLOG_PROJECT_ID = 246

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  chapterId: number | null
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'src', 'app', 'blog', 'posts')
  const filenames = await fs.readdir(postsDirectory)
  const markdownFiles = filenames.filter((file) => file.endsWith('.md'))

  const posts = await Promise.all(
    markdownFiles.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: filename.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date ? new Date(data.date).toLocaleDateString() : 'No date',
        excerpt: data.excerpt || 'No excerpt available',
        chapterId: data.chapterId || null,
      }
    }),
  )

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function getChapters(chapterIds: number[]): Promise<Chapter[]> {
  const chapters: Chapter[] = []
  return chapters.map(serializeChapter)
}

export async function getChapter(
  chapterId: number | null,
): Promise<Chapter | null> {
  if (!chapterId) {
    return null
  }

  const chapter = null

  return serializeChapter(chapter)
}
