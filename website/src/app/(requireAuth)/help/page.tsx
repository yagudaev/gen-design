
import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'

import BlurImage from '@/components/mdx/BlurImage'
import { replaceLinks } from '@/lib/mdx/remark-plugins'

async function getMarkdownFile() {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      'src',
      'app',
      '(requireAuth)',
      'help',
      'getting-started.mdx',
    ),
    'utf8',
  )
  const { content, data } = matter(source)
  // const mdxSource = await serialize(content)

  return { content, frontMatter: data }
}
const components = {
  BlurImage,
  a: replaceLinks,
}

export default async function StartPage() {
  const { content, frontMatter } = await getMarkdownFile()

  const post = {
    title: frontMatter.title,
    content: 'some markdown coming soon',
  }
  return (
    <div className={''}>
      <div className="relative overflow-hidden bg-white py-16">
        <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full">
          <div
            className="relative mx-auto h-full max-w-prose text-lg"
            aria-hidden="true"
          >
            {/* pattern */}
            <svg
              className="absolute left-full top-12 translate-x-32 transform"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
              />
            </svg>
            <svg
              className="absolute right-full top-1/2 -translate-x-32 -translate-y-1/2 transform"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute bottom-12 left-full translate-x-32 transform"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="d3eb07ae-5182-43e6-857d-35c643af9034"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
              />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <h1 className="mt-5">
              {/* <span className='block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase'>
                Introducing
              </span> */}
              {/* <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
                {post.title}
              </span> */}
            </h1>
          </div>
          <div className="prose prose-lg prose-indigo mx-auto mt-6 text-gray-500">
            <MDXRemote source={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
