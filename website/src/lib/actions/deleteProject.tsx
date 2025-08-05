'use client'
import { deleteAt, insertAt } from '@workspace/shared/utils'
import React from 'react'
import toast from 'react-hot-toast'

import { callApi } from '@/lib/callApi'
import { Project } from '@/types'

export async function deleteProject(
  project: Project,
  {
    beforeDelete,
    afterDelete,
    onError,
  }: {
    beforeDelete?: () => void
    afterDelete?: () => void
    onError?: (e: any) => void
  } = {},
) {
  if (confirm('Are you sure you want to delete this project?')) {
    const projectId = project.id
    beforeDelete?.()

    try {
      const { project } = await callApi<{ project: Project }>(
        `/api/projects/${projectId}`,
        {
          method: 'DELETE',
        },
      )
      toast.success('Project deleted successfully!')
      afterDelete?.()

      return project
    } catch (e) {
      toast.error('Failed to delete project')

      onError?.(e)
    }
  }
}
export async function deleteProjectOptimistic(
  project: Project,
  allProjects: Project[],
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>,
) {
  if (confirm('Are you sure you want to delete this project?')) {
    const projectId = project.id
    const deletedPosition = allProjects.findIndex((p) => p.id === projectId)

    await deleteProject(project, {
      beforeDelete: () =>
        // remove the project from the list
        setAllProjects((projects) => deleteAt(projects, deletedPosition)),
      onError: () => {
        // add the project back to the list
        setAllProjects((projects) =>
          insertAt(projects, deletedPosition, project),
        )
      },
    })
  }
}
