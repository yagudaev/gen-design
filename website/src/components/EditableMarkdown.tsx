'use client'

import { LucideEdit } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

import { Button } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'

export default function EditableMarkdown({
  resource,
  resourceUrl,
  setResource,
  resourceKey = 'name',
}: {
  resource: { id: number; [key: string]: any } | null
  resourceUrl: string
  setResource: any
  resourceKey?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempValue] = useState('')
  const resourceId = resource?.id
  const markdownRef = React.useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState(0)
  const [minWidth, setMinWidth] = useState(0)

  async function saveTitle() {
    if (!resource) return

    const oldTitle = resource[resourceKey as keyof typeof resource]
    if (tempTitle !== '' && tempTitle !== oldTitle) {
      // optimistic update
      setResource({ ...resource, [resourceKey]: tempTitle })

      try {
        // Call the API to update the project
        await callApi(resourceUrl, {
          method: 'PATCH',
          body: JSON.stringify({ [resourceKey]: tempTitle }),
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
    setTempValue(resource?.[resourceKey] || '')
    setMinHeight(markdownRef.current?.offsetHeight || 100)
    setMinWidth(markdownRef.current?.offsetWidth || 100)
    setIsEditing(true)
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="flex items-start">
        {isEditing ? (
          <textarea
            value={tempTitle}
            style={{
              minHeight: minHeight,
              minWidth: minWidth,
            }}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) saveTitle()
            }}
            autoFocus
            className="w-full"
          />
        ) : (
          <div ref={markdownRef} onDoubleClick={startEditing} className="prose">
            <ReactMarkdown>{resource?.[resourceKey]}</ReactMarkdown>
          </div>
        )}
        <Button variant="ghost" className="ml-4" onClick={startEditing}>
          <LucideEdit className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
