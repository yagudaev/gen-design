import Link from 'next/link'


import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'

import { getBlogPosts, getChapters } from './data'

export default async function BlogPostsPage() {
  const blogPosts = await getBlogPosts()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ]

  const chapterIds = blogPosts.map((post) => post.chapterId)
  const filteredChapterIds = chapterIds.filter(
    (id): id is number => id !== null,
  )
  // throw if there are null ids
  if (filteredChapterIds.length !== chapterIds.length) {
    throw new Error('Null chapter id found')
  }

  const chapters = await getChapters(filteredChapterIds)
  // const project = {} as any

  return (
    <PageBody className="flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        <Breadcrumbs items={breadcrumbs} className="mb-4 text-left" />
        <div className="flex justify-between items-center">
          <h1 className="mb-4 text-5xl font-bold">Blog Posts</h1>
          {/* <PlayProjectButton project={project} /> */}
        </div>
        <ul className="space-y-4">
          {blogPosts.map((post, index) => {
            const chapter = chapters[index]
            return (
              <li key={post.slug} className="pb-4 border-b">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {chapter && (
                    <div>
                      {/* <PlayChapterButton chapter={chapter} queue={chapters} /> */}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">{post.date}</p>
                <p className="mt-2">{post.excerpt}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </PageBody>
  )
}
