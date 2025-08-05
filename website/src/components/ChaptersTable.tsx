'use client'

import { ColumnDef } from '@tanstack/react-table'
import { cn, formatDateShort } from '@workspace/shared/utils'
import { useMemo } from 'react'


import AnimatedAudioLinesIcon from '@/components/AnimatedAudioLinesIcon'
// import { useAudioPlayer } from '@/components/AudioPlayer'
// import { PlayChapterButton } from '@/components/PlayButtons'
import { SortableColumnHeader } from '@/components/SortableColumnHeader'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useHistoryItems } from '@/hooks/historyItem'
import { Chapter } from '@/types'

import ChapterListeningProgress from './chapters/ChapterListeningProgress'

interface ChaptersTableProps {
  chapters: Chapter[]
  className?: string
}

export function ChaptersTable({ chapters, className }: ChaptersTableProps) {
  // const { currentlyPlaying, playing } = useAudioPlayer()
  const chapterIds = useMemo(() => chapters.map((c) => c.id), [chapters])
  const historyItems = useHistoryItems(chapterIds)

  const chaptersWithAudioUrls = chapters.filter(
    (c) => c.versions?.find((v) => v.voice === c.voice)?.audioUrl,
  )

  const columnsResponsive: (ColumnDef<Chapter> | false)[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <SortableColumnHeader column={column} className="pl-0">
            Name
          </SortableColumnHeader>
        )
      },
      cell: ({ getValue, row }) => {
        const chapter = row.original
        const chapterId = chapter.id
        const contentSlug = chapter.slug
        const title = getValue<string>()
        const url = `/playlists/${contentSlug}`
        // const isCurrentChapter = currentlyPlaying?.id === chapterId
        // const isCurrentlyPlaying = isCurrentChapter && playing

        return (
          <Button
            variant="link"
            href={url}
            prefetch={false}
            title={title}
            className={cn(
              // isCurrentChapter ? 'font-bold' : 'font-medium',
              'block overflow-hidden pl-0 whitespace-nowrap text-ellipsis max-w-[200px] md:max-w-[400px]',
            )}
          >
            {title}
            {/* {isCurrentChapter && (
              <AnimatedAudioLinesIcon
                className="ml-2"
                isPlaying={isCurrentlyPlaying}
              />
            )} */}
          </Button>
        )
      },
    },
    {
      accessorKey: 'publishedAt',
      meta: {
        className: 'hidden md:table-cell',
      },
      header: ({ column }) => {
        return (
          <SortableColumnHeader column={column}>Published</SortableColumnHeader>
        )
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>()
        return value ? formatDateShort(new Date(value)) : '-'
      },
    },
    {
      accessorKey: 'listeningProgress',
      header: 'Listening Progress',
      cell: ({ row }) => {
        const chapter = row.original
        const version = chapter.versions?.find((v) => v.voice === chapter.voice)

        return (
          <div className="flex items-center gap-4 w-[200px]">
            {version?.audioUrl ? (
              <ChapterListeningProgress
                chapterId={chapter.id}
                historyItems={historyItems}
              />
            ) : (
              <span>-</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      meta: {
        className: '',
      },
      header: () => (
        <div className="hidden justify-end items-center md:flex">
          <span>Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const chapter = row.original
        const currentVersion = chapter.versions?.find(
          (v) => v.voice === chapter.voice,
        )

        return (
          <div className="justify-end items-center whitespace-nowrap md:flex">
            {/* {currentVersion?.audioUrl && (
              <PlayChapterButton
                chapter={chapter}
                queue={chaptersWithAudioUrls}
              />
            )} */}
          </div>
        )
      },
    },
  ]

  const columns = columnsResponsive.filter(
    (column) => column !== null && column !== false,
  ) as ColumnDef<Chapter>[]

  return (
    <DataTable
      className={className}
      columns={columns}
      data={chapters}
      key={`files-${chapters.length}`}
    />
  )
}
