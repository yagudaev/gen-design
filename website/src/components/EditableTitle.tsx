'use client'

import { cn } from '@workspace/shared/utils'
import { LucideEdit } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'


import { Title } from './Title'


export default function EditableTitle({
  resource,
  resourceUrl,
  setResource,
  className,
}: {
  resource: { id: number; name: string } | null
  resourceUrl: string
  setResource: any
  className?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const resourceId = resource?.id
  const ref = React.useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState(0)
  const [minWidth, setMinWidth] = useState(0)

  async function saveTitle() {
    if (!resource) return

    const oldTitle = resource.name
    if (tempTitle !== '' && tempTitle !== oldTitle) {
      // optimistic update
      setResource({ ...resource, name: tempTitle })

      try {
        // Call the API to update the project
        await callApi(resourceUrl, {
          method: 'PATCH',
          body: JSON.stringify({ name: tempTitle }),
        })

        toast.success('Project updated successfully!')
      } catch (e) {
        console.error('Error updating project:', e)
        toast.error('Failed to update project')

        // revert the optimistic update
        setResource({ ...resource, name: oldTitle })
      }
    }
    setIsEditing(false)
  }

  function startEditing() {
    setTempTitle(resource?.name || '')
    setMinHeight(ref.current?.offsetHeight || 100)
    setMinWidth(ref.current?.offsetWidth || 100)
    setIsEditing(true)
  }

  return (
    <div
      className={cn(
        'flex flex-col w-full md:flex-row md:justify-between md:items-center',
        className,
      )}
    >
      <div className="flex items-center">
        {isEditing ? (
          <textarea
            // type="text"
            value={tempTitle}
            style={{
              minHeight: minHeight + 'px',
              minWidth: minWidth + 'px',
            }}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
            autoFocus
            className="text-5xl break-smart"
          />
        ) : (
          <Title ref={ref}>{resource?.name}</Title>
        )}
        <Button variant="ghost" className="ml-4" onClick={startEditing}>
          <LucideEdit />
        </Button>
      </div>
    </div>
  )
}
