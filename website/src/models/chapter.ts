// maybe we can make models into classes wrapping the object like ChapterModel wraps the Chapter object which is a plain object
// with a base model too, like rails

// import { Chapter, Prisma, Version } from '@prisma/client'
// import { put } from '@vercel/blob'

// import { prisma } from '@/lib/db'
// import { serializeChapterWithChunks, serializeHistoryItem } from '@/serializers'
// import * as ChapterService from '@/services/chapter'
// import { Project } from '@/types'

// type RecentlyPlayedResult = Prisma.ChapterGetPayload<{
//   include: {
//     project: true
//   }
// }> & {
//   createdAt: Date // from HistoryItem
// }

// export async function findPublicChapter(slug: string) {
//   const chapter = await prisma.chapter.findUnique({
//     where: {
//       slug,
//       public: true,
//     },
//     include: {
//       chunks: true,
//       project: true,
//       versions: {
//         include: {
//           chunks: true,
//         },
//       },
//     },
//   })

//   if (!chapter) return null
//   return serializeChapterWithChunks(chapter)
// }

// export async function generateSocialPreview(slug: string) {
//   console.time('generateSocialPreview')

//   const chapter = await prisma.chapter.findUnique({
//     where: {
//       slug,
//       public: true,
//     },
//     include: {
//       project: true,
//     },
//   })
//   console.timeLog('generateSocialPreview', 'DB query completed')

//   if (!chapter) return null

//   const previewUrl = `${process.env.BASE_URL}/social-preview/p/${chapter.id}-${chapter.slug}`
//   const screenshotOneUrl = `
//     https://api.screenshotone.com/take?
//     access_key=btqXWDoZsId6QA
//     &url=${encodeURIComponent(previewUrl)}
//     &full_page=false
//     &viewport_width=1200
//     &viewport_height=630
//     &device_scale_factor=1
//     &format=jpg
//     &image_quality=80
//     &block_ads=true
//     &block_cookie_banners=true
//     &block_banners_by_heuristics=false
//     &block_trackers=true
//     &delay=0
//     &timeout=10
//   `.replace(/\s+/g, '')

//   console.timeLog('generateSocialPreview', 'Before screenshot fetch')
//   const response = await fetch(screenshotOneUrl)
//   const buffer = await response.arrayBuffer()
//   console.timeLog('generateSocialPreview', 'Screenshot fetched')

//   const { url } = await put(`social-previews/${chapter.id}/v1.jpg`, buffer, {
//     access: 'public',
//   })
//   console.timeLog('generateSocialPreview', 'Image uploaded to blob storage')

//   await prisma.chapter.update({
//     where: { id: chapter.id },
//     data: { openGraphImageUrl: url },
//   })

//   console.timeEnd('generateSocialPreview')
//   return url
// }
