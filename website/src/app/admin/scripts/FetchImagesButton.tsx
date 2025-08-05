'use client'

import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'

export function FetchImagesButton() {
  return (
    <Button
      onClick={async () => {
        try {
          await callApi('/api/admin/scripts/fetch-images-from-urls', {
            method: 'POST',
          })
          toast.success('Script executed')
        } catch (error) {
          console.error('Failed to execute script', error)
          toast.error('Failed to execute script')
        }
      }}
      className="md:w-min"
    >
      Fetch images from URLs
    </Button>
  )
}
