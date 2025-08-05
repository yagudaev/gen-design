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

export function ShareDialog({
  link,
  show,
  setShow,
}: {
  link: string
  show: boolean
  setShow: any
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
          <DialogTitle>Share Chapter</DialogTitle>
        </DialogHeader>

        <div>
          <DialogDescription>
            Use this link to share this chapter with others
          </DialogDescription>
          <TextField className="mt-4" value={link} />
          <Button
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(link)
              toast.success('Copied to clipboard')
            }}
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
