'use client'
import toast from 'react-hot-toast'

import { TextField } from '@/components/Fields'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'


export function RSSFeedDialog({
  link,
  show,
  setShow,
}: {
  link: string
  show: boolean
  setShow: (show: boolean) => void
}) {
  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        setShow(open)

        // workaround: https://github.com/shadcn-ui/ui/issues/1912#issuecomment-2187447622
        setTimeout(() => {
          if (!open) {
            document.body.style.pointerEvents = ''
          }
        }, 100)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Podcast Link (RSS)</DialogTitle>
        </DialogHeader>

        <div>
          <DialogDescription>
            Use this link to listen to content in your favorite podcast player
          </DialogDescription>
          <TextField className="mt-4" value={link} />
          <div className="flex justify-between mt-4 w-full">
            <Button
              className=""
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(link)
                toast.success('Copied to clipboard')
              }}
            >
              Copy
            </Button>

            <Button
              onClick={() => {
                // Open podcast URL in default application
                window.open(link, '_blank')
                toast.success('Opening podcast link...')
              }}
            >
              Open in Podcast Player
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
