'use client'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

export function FileUploadButton({
  children,
  className,
  variant = 'default',
  onUpload = async () => {},
}: {
  children: React.ReactNode
  className?: string
  variant?: ButtonProps['variant']
  onUpload?: (formData: FormData) => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploading(true)
    const file = event.target.files ? event.target.files[0] : null
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    await onUpload(formData)

    setUploading(false)
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        className={className}
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        loading={uploading}
        loadingLabel="Uploading..."
        variant={variant}
      >
        {children as any}
      </Button>
    </>
  )
}
