import SvgLogo from '@workspace/shared/Logo'
import Image from 'next/image'

import { LucidePlayRounded } from '@/components/icons/LucidePlayRounded'
import { callApi } from '@/lib/callApi'

interface Project {
  id: number
  name: string
  createdAt: string
  status: string
}

interface Chapter {
  id: number
  name: string
  url: string
  createdAt: string
  status: string
  content: string
  audioUrl: string
  projectId: number
  sourceUrl: string
  thumbnailUrl: string
  coverUrl: string
  project: Project
}

interface Project {
  id: number
  name: string
  createdAt: string
  status: string
}

export default async function ChaptersPage(props: {
  params: Promise<{ idSlug: string }>
}) {
  const params = await props.params
  const { idSlug } = params
  const [idStr, slug] = idSlug.split('-')
  const id = Number(idStr)
  const { chapter } = await callApi<{ chapter: Chapter }>(
    `${process.env.BASE_URL}/api/public/chapters/${id}`,
  )

  return (
    <div className="w-[1200px] h-[630px] overflow-hidden flex flex-col items-center bg-white">
      {/* body */}
      <div className="flex flex-col items-center flex-grow mt-16">
        {/* website */}
        <div className="flex items-center px-8 space-x-2">
          <img
            src={chapter.thumbnailUrl}
            width={50}
            height={50}
            alt="thumbnail image"
          />
          <h2 className="text-2xl line-clamp-1">
            {new URL(chapter.sourceUrl).origin.replace(
              /https?:\/\/(www\.)?/,
              '',
            )}
          </h2>
        </div>
        {/* Title */}
        <h1 className="px-8 pb-1 mt-8 text-6xl font-bold line-clamp-3">
          {chapter.project.name}: {chapter.name}
        </h1>

        <div className="flex items-center justify-center flex-grow">
          <LucidePlayRounded className="w-24 h-24 mt-[9px] opacity-80" />
          <Image
            src={'/images/audiowave-graph.png'}
            width={1015}
            height={150}
            alt="audiowave graph"
          />
        </div>
      </div>
      {/* footer */}
      <div className="flex items-center justify-center w-full py-4 space-x-3 text-xl text-white bg-primary">
        <SvgLogo className="w-12 h-12" />
        <span className="text-2xl font-normal">audiowaveai.com</span>
      </div>
    </div>
  )
}
