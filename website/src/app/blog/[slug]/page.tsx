import fs from 'fs/promises'
import path from 'path'

import matter from 'gray-matter'
import { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { JsonLd } from 'react-schemaorg'
import remarkGfm from 'remark-gfm'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'

import { getChapter } from '../data'

interface BlogPost {
  slug: string
  title: string
  date: string
  content: string
  excerpt: string
  author: {
    name: string
    slug: string
  }
  category: string
  readingTime: string
  coverImage: string
  chapterId: number | null
}

// Add this function to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readingTime} min read`
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  const blogUrl = `https://audiowaveai.com/blog/${params.slug}`
  return {
    title: `${post.title} | Vibeflow Blog`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: [post.category],
      images: [{ url: post.coverImage }],
      url: blogUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage(props0: {
  params: Promise<{ slug: string }>
}) {
  const params = await props0.params
  const post = await getBlogPost(params.slug)
  const blogUrl = `https://audiowaveai.com/blog/${params.slug}`
  const chapter = await getChapter(post.chapterId)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${params.slug}` },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    description: post.excerpt || post.content.slice(0, 160),
    image: post.coverImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
  }

  return (
    <>
      <Head>
        <link rel="canonical" href={blogUrl} />
      </Head>
      <JsonLd item={structuredData} />
      <PageBody className="flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl">
          <Breadcrumbs items={breadcrumbs} className="mb-4 text-left" />
          <article className="max-w-[820px]">
            <h1 className="mb-2 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center mb-4 text-sm text-gray-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString()}
              </time>
              <span className="mx-2">•</span>
              <span>{post.readingTime}</span>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
            </div>
            {chapter && (
              <div className="mb-4">
                {/* <PlayChapterButton chapter={chapter} queue={[chapter]} /> */}
              </div>
            )}
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={820}
                height={410}
                className="mb-4 rounded-lg"
              />
            )}
            <div className="mt-4 prose lg:prose-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h2 {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </PageBody>
    </>
  )
}

async function getBlogPost(slug: string): Promise<BlogPost> {
  const postsDirectory = path.join(process.cwd(), 'src', 'app', 'blog', 'posts')
  const filePath = path.join(postsDirectory, `${slug}.md`)

  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const readingTime = calculateReadingTime(content)

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date).toISOString() : 'No date',
      content: content,
      excerpt: data.excerpt || '',
      author: data.author || { name: 'Anonymous', slug: 'anonymous' },
      category: data.category || 'Uncategorized',
      readingTime: readingTime,
      coverImage: data.coverImage || '',
      chapterId: data.chapterId || null,
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    notFound()
  }
}
