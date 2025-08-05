'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDateShort, truncateText } from '@workspace/shared/utils'
import { LucideDownload, LucideLink, LucideTrash } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { RSSFeedDialog } from '@/components/dialogs/RSSFeedDialog'
import {
  MoreActions,
  MoreActionsItem,
  MoreActionsItemSeparator,
} from '@/components/MoreActions'
import { PageBody } from '@/components/PageBody'
import { SortableColumnHeader } from '@/components/SortableColumnHeader'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import config from '@/config'
import { createPodcastLink } from '@/lib/actions/createPodcastLink'
import { deleteProjectOptimistic } from '@/lib/actions/deleteProject'
import { downloadProject } from '@/lib/actions/downloadProject'
import { callApi } from '@/lib/callApi'
import { useResponsive, useTitle } from '@/lib/hooks'
import { Project, ProjectWithDownloadStatus } from '@/types'

const BASE_URL = config.baseUrl

export default function SearchPage() {
  const [loading, setLoading] = useState(true)
  const [showRSSFeedLink, setShowRSSFeedLink] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const searchParams = useSearchParams()
  const query = searchParams?.get('q')

  const screenSize = useResponsive()
  const [showAll, setShowAll] = useState(false)

  useTitle('Search')

  const [allProjects, setAllProjects] = useState<ProjectWithDownloadStatus[]>(
    [],
  )

  // apply scope
  const projects = showAll ? allProjects : allProjects.slice(0, 5)

  const columnsResponsive: (ColumnDef<ProjectWithDownloadStatus> | null)[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <SortableColumnHeader column={column}>
            Project Name
          </SortableColumnHeader>
        )
      },
      cell: ({ getValue, row }) => {
        const projectId = row.original.id
        const title = getValue<string>()
        return (
          <span className="font-medium">
            <Button
              variant="link"
              href={`/projects/${projectId}`}
              title={title}
            >
              {truncateText(title, screenSize.md ? 80 : 20)}
            </Button>
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <SortableColumnHeader column={column}>
            Created At
          </SortableColumnHeader>
        )
      },
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return formatDateShort(new Date(value))
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <span className="hidden w-full text-right md:block">Actions</span>
      ),
      cell: ({ row }) => {
        const project = row.original

        return (
          <div className="flex justify-end items-center whitespace-nowrap">
            {/* {project.availableForDownload && (
              <PlayProjectButton project={project} />
            )} */}

            <MoreActions variant="ghost" className="ml-4">
              <MoreActionsItem
                icon={<LucideDownload />}
                onClick={async () => {
                  if (!project) return

                  if (!project.chapters) {
                    // fetch chapters for project
                    const { project: updatedProject } = await callApi<{
                      project: Project
                    }>(`/api/projects/${project.id}`)

                    downloadProject(updatedProject)
                  } else {
                    downloadProject(project)
                  }
                }}
                disabled={!project.availableForDownload}
                title={
                  !project.availableForDownload
                    ? 'No audio to download, process the project first'
                    : undefined
                }
              >
                Download All
              </MoreActionsItem>
              <MoreActionsItem
                icon={<LucideLink />}
                onClick={async () => {
                  if (!project) return

                  await createPodcastLink(project, {
                    onSuccess: (updatedProject) => {
                      setSelectedProject(updatedProject)
                      setShowRSSFeedLink(true)
                    },
                  })
                }}
              >
                Get Podcast Link (RSS)
              </MoreActionsItem>
              <MoreActionsItemSeparator />
              <MoreActionsItem
                className="text-red-600"
                icon={<LucideTrash />}
                onClick={async () => {
                  deleteProjectOptimistic(
                    project,
                    allProjects,
                    setAllProjects as Dispatch<SetStateAction<Project[]>>,
                  )
                }}
              >
                Delete Project
              </MoreActionsItem>
            </MoreActions>
          </div>
        )
      },
    },
  ]
  const columns = columnsResponsive.filter(
    (column) => column !== null,
  ) as ColumnDef<ProjectWithDownloadStatus>[]

  useEffect(() => {
    fetchProjects()
  }, [query])

  async function fetchProjects() {
    setLoading(true)
    const { projects } = await callApi<{
      projects: ProjectWithDownloadStatus[]
    }>(`/api/search?q=${query}`)
    setAllProjects(projects)
    setLoading(false)
  }

  return (
    <PageBody>
      <section
        id="Projects"
        aria-labelledby="page-title"
        className="overflow-hidden relative bg-slate-0"
      >
        {/* header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-5xl">Search results</h1>
        </div>

        <div className="flex justify-between mt-2 space-x-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h2 className="text-3xl">Projects</h2>
          </div>
          <div>
            <Button
              variant="link"
              className="text-left"
              onClick={() => {
                setShowAll(!showAll)
              }}
            >
              View {allProjects.length} results
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={projects}
          className=""
          loading={loading}
        />
      </section>
      {showRSSFeedLink && (
        <RSSFeedDialog
          link={`${BASE_URL}/podcasts/${selectedProject?.podcastToken}`}
          show={showRSSFeedLink}
          setShow={(show) => {
            setShowRSSFeedLink(show)
            setSelectedProject(null)
          }}
        />
      )}
    </PageBody>
  )
}
