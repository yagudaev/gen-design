'use client'

import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

import { AnalyzeChaptersButton } from '../AnalyzeChaptersButton'

export function AnalyzeChaptersSection() {
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [includePublishedDate, setIncludePublishedDate] = useState(false)

  return (
    <div className="flex items-end space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project IDs (comma-separated)
        </label>
        <input
          type="text"
          className="block mt-1 w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(e) =>
            setSelectedProjectIds(
              e.target.value
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean),
            )
          }
          placeholder="e.g. 123, 456 (all projects if empty)"
        />
      </div>
      <div className="flex items-center space-x-2 h-10">
        <Checkbox
          id="includePublishedDate"
          checked={includePublishedDate}
          onCheckedChange={(checked) => setIncludePublishedDate(!!checked)}
        />
        <label htmlFor="includePublishedDate" className="text-sm">
          Include chapters without published date
        </label>
      </div>
      <AnalyzeChaptersButton
        projectIds={selectedProjectIds}
        includePublishedDate={includePublishedDate}
      />
    </div>
  )
}
