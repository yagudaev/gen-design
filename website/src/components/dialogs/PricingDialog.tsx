'use client'

import { InAppPricing } from '@/components/InAppPricing'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function PricingDialog({
  show,
  setShow,
}: {
  show: boolean
  setShow: (show: boolean) => void
}) {
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-2xl">
        <InAppPricing />
      </DialogContent>
    </Dialog>
  )
}
