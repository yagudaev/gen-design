// import { logger, task, wait } from '@trigger.dev/sdk/v3'

// import {
//   extractCoverUrl,
//   extractThumbnailUrl,
// } from '@/app/api/projects/imageExtractor'
// import { prisma } from '@/lib/db'

// export const extractImagesFromUrl = task({
//   id: 'extract-url-images',
//   run: async (
//     { chapterId, url }: { chapterId: number; url: string },
//     { ctx },
//   ) => {
//     logger.log('Extract URL Images', { url, ctx })

//     const response = await fetch(url)
//     const rawHtml = await response.text()

//     let thumbnailUrl = await extractThumbnailUrl(url, rawHtml)
//     let coverUrl = await extractCoverUrl(url, rawHtml)

//     await prisma.chapter.update({
//       where: { id: chapterId },
//       data: {
//         thumbnailUrl,
//         coverUrl,
//       },
//     })

//     return {
//       thumbnailUrl,
//       coverUrl,
//     }
//   },
// })
