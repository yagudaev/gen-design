'use client'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

export default function FileUploadField({
  children,
  className,
  variant = 'default',
  onUpload = async () => {},
  inputProps = { accept: '.txt, .epub, .pdf, .md' },
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: ButtonProps['variant']
  onUpload?: (file: File) => void
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
} & ButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  // const [uploading, setUploading] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null
    if (!file) return

    onUpload(file)

    // Reset the value of the input so the next change event will always fire
    event.target.value = ''
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        {...inputProps}
      />
      <Button
        className={className}
        type="button"
        onClick={handleButtonClick}
        // disabled={uploading}
        // loading={uploading}
        loadingLabel="Uploading..."
        variant={variant}
        {...props}
      >
        {children as any}
      </Button>
    </>
  )
}
